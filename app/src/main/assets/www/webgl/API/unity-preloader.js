/* #################################################################################################### */

	/**
	 * Недостающие полифилы можно сгенерировать тут:
	 * 		https://polyfill.io/
	 *		затем на любой странице Electron-приложения делаем переход:
	 *		window.location.assign("https://polyfill.io/v3/polyfill.js?version=3.111.0&features=String.prototype.replaceAll");
	 *		и копируем в файл Polyfills/polyfill-name.js
	 */
	
	// App:
		var _strAppName		= "VoxMain";
		var _strHash		= "?t=1789387914";
		var _fCache			= false;
	
/* #################################################################################################### */

/* --------------------------------------------------------- */
/**
 * 		Unity API
 * 		Version: 1.3.7
 * 		Updated: 24.11.2025
 * 		@Mersibo, 2025
 */
/* --------------------------------------------------------- */

	class CUnityAPI
	{
		/**
		 * ID API.
		 */
			app_id				= 'app-unity-voxmain';
		/**
		 * Версия API.
		 */
			version				= '1.3.7';
		
		/**
		 * Все переменные среды.
		 */
			browser_vars		= {};
		
		/**
		 * Избранные игры.
		 */
			favourite_games_ids	= [];
		
		/**
		 * Режим разработчика.
		 */
			is_dev_mode			= false;
		
		/**
		 * Выполнена ли инициализация (установлена ли связь с приложением).
		 */
			is_init				= false;
		/**
		 * Приостановленно ли приложение.
		 */
			is_in_sleep			= false;
		
		/**
		 * Основная версия или версия для сенсорных экранов.
		 */
			is_touch_version	= false;
		
		/**
		 * Unity приложение.
		 */
			unity_instance		= null;
		
		/* --------------------------------------------------------- */
		/**
		 * Конструктор.
		 * 
		 * @param	a_app_id			ID основного div'а страницы.
		 */
			constructor() {
			}
		
		/**
		 * Вычисление объёма указанной базы данных (bytes).
		 */
			calcIndexedDBSize(a_db_name)
			{
				return new Promise((resolve) => {
					var settled = false;
					function done(size) {
						if (!settled) {
							settled = true;
							resolve(size || 0);
						}
					}
					var timer = setTimeout(function() { done(0); }, 1500);
					try {
						var bdSize = 0;
						var pIDBRequest = indexedDB.open(a_db_name);
						pIDBRequest.onerror = function() { clearTimeout(timer); done(0); };
						pIDBRequest.onsuccess = function() {
							try {
								let dbDB = pIDBRequest.result;
								if (!dbDB || dbDB.objectStoreNames.length == 0) {
									clearTimeout(timer);
									done(bdSize);
									return;
								}
								var dbCursor = dbDB.transaction(dbDB.objectStoreNames).objectStore(dbDB.objectStoreNames[0]).openCursor();
								dbCursor.onerror = function() { clearTimeout(timer); done(bdSize); };
								dbCursor.onsuccess = function(event) {
									let bdCursor = event.target.result;
									if (bdCursor) {
										let storedObject = bdCursor.value;
										let json = JSON.stringify(storedObject);
										bdSize += json.length;
										if (storedObject.hasOwnProperty("size"))
											bdSize += storedObject.size;
										bdCursor.continue();
									} else {
										clearTimeout(timer);
										done(bdSize);
									}
								};
							} catch(err) {
								clearTimeout(timer);
								done(0);
							}
						};
					} catch(e) {
						clearTimeout(timer);
						done(0);
					}
				});
			}
		
		/**
		 * Запрос на очистку кэша приложения (IndexedDB).
		 */
			clearAppCache(a_is_files_idb, a_is_cache_idb)
			{
				if (a_is_files_idb)
					this.clearAppCacheDoIt("/idbfs");
				if (a_is_cache_idb)
					this.clearAppCacheDoIt("UnityCache");
			}
			
			clearAppCacheDoIt(a_db_name)
			{
				var pIDBRequest	= indexedDB.open(a_db_name);
				pIDBRequest.onsuccess	= function() {
						let dbDB			= pIDBRequest.result;
							if (!dbDB || dbDB.objectStoreNames.length == 0) {
								console.log("JS: IndexedDB " + a_db_name + " not cleared.");
								return;
							}
						let objectStore		= dbDB.transaction(dbDB.objectStoreNames, "readwrite").objectStore(dbDB.objectStoreNames[0]);
						let objectStoreRq	= objectStore.clear();
						objectStoreRq.onsuccess = (event) => {
						    	console.log("JS: IndexedDB " + a_db_name + " cleared.");
							};
					};
			}
		
		/**
		 * Запрос на очистку кэша приложения (полностью).
		 * DEV only!
		 */
			devClearAppCache()
			{
				this.sendToHost('devClearAppCache', null);
			}
		
		/**
		 * Требуется обновить основное приложение (Студию).
		 */
			downloadAppUpdates()
			{
				// TODO...
			}
		
		/**
		 * Unity-приложение запрашивает переменные среды.
		 */
			getBrowserVars()
			{
				if (this.browser_vars != null)
					return JSON.stringify(this.browser_vars);
				
				return "";
			}
		
		/**
		 * Инициализация переменных среды для быстрого доступа.
		 * 
		 * @param	data	Переменные среды.
		 */
			initBrowserVars(a_data)
			{
				if (a_data != null)
				{
					for (var strKey in a_data)
						this.browser_vars[strKey]	= a_data[strKey];
					
					this.favourite_games_ids	= a_data.favourite_games_ids;
					this.is_dev_mode			= a_data.is_dev_mode === true;
					this.is_touch_version		= a_data.is_touch_version === true;
				}
			}
		
		/**
		 * Unity-приложение активировано (по команде wakeup).
		 */
			onAppActivated()
			{
				this.sendToHost('onAppActivated', null);
			}
		
		/**
		 * Ошибка во время выполнения Unity-приложения.
		 * 
		 * @param	a_error			String	Текст ошибки.
		 */
			onAppError(a_error)
			{
				this.sendToHost('onError', { error: a_error });
				
				/*_apiIsErrors	= true;*/
			}
		
		/**
		 * Unity-приложение намерено завершить работу.
		 */
			onAppExit()
			{
				// оповестим и дождёмся команды 'sleep':
				this.sendToHost('onAppExit', null);
			}
		
		/**
		 * Unity-приложение завершило работу.
		 */
			onAppExitComplete()
			{
				// завершили работу, ожидаем команду 'wakeup':
				this.sendToHost('onAppExitComplete', null);
			}
		
		/**
		 * Сообщение в лог от Unity-приложения.
		 * 
		 * @param	a_message		String	Текст сообщения.
		 * @param	a_warning		Boolean	True для предупреждения.
		 */
			onAppLog(a_message, a_warning)
			{
				this.sendToHost('onLog', { message: a_message, is_warinig: a_warning });
			}
		
		/**
		 * Unity-приложение полностью загружено.
		 */
			onAppStarted()
			{
				this.sendToHost('onAppLoadComplete', { errors: '' });
				_idCanvas.focus();
			}
		
		/**
		 * Указанная Unity-игра завершилась (gameover).
		 * 
		 * @param	a_game_id		Number	ID игры.
		 * @param	a_game_result	String	Json с результатами игры.
		 * @param	a_game_unic		String	Json с уникальными настройками игры.
		 */
			onGameOver(a_game_id, a_game_result, a_game_unic)
			{
				//this.sendToHost('eventWebviewGameAPI', { command: 'onGameOver', data: [a_game_id, a_game_result, a_game_unic] });
				this.sendToHost('onGameOver', { game_id: a_game_id, game_result: a_game_result, game_unic: a_game_unic });
			}
		
		/**
		 * Указанная Unity-игра загружена и стартовала.
		 * 
		 * @param	a_game_id		Number	ID игры.
		 */
			onGameStarted(a_game_id)
			{
				//this.sendToHost('eventWebviewGameAPI', { command: 'onGameStartOfficially', args: [a_game_id] });
				this.sendToHost('onGameStarted', { game_id: a_game_id });
			}
		
		/**
		 * Текущая Unity-игра остановлена (начала выгружаться).
		 */
			onGameStop()
			{
				//this.sendToHost('eventWebviewGameAPI', { command: 'onGameStop', args: [] });
				this.sendToHost('onGameStop', null);
			}
		
		/**
		 * Текущая Unity-игра остановлена и полностью выгружена.
		 */
			onGameStopped()
			{
				/*if (this.is_in_sleep) {
					// если ожидаем завершения работы:
					//this.sendToHost('eventWebviewOnExit', 'ok');
					this.sendToHost('onAppExitComplete', null);
				}
				else {*/
				this.sendToHost('onGameStopped', null);
				//}
			}
		
		/**
		 * Unity-приложение потеряло коннект к серверу.
		 * 
		 * @param	a_is_auth		Number	Потеряна ли авторизация или это по пингу.
		 */
			onLostSession(a_is_auth)
			{
				// TODO...
			}
		
		/**
		 * Запрос на вывод игрового документа на печать.
		 * 
		 * @param	a_game_id		ID игры.
		 * @param	a_doc_url		URL документа.
		 */
			printGameDoc(a_game_id, a_doc_url)
			{
				// ответ в onPrintComplete:
				this.sendToHost('printGameDoc', { game_id: a_game_id, doc_url: a_doc_url });
			}
		
		/**
		 * Сообщение для основного приложения.
		 * 
		 * @param	a_command	Команда/событие.
		 * @param	a_data		Передаваемые данные.
		 */
			sendToHost(a_command, a_data)
			{
				// обязательно указываем id отправителя (иначе в window.parent смешаются события от разных приложений):
				let customEvent 	= new CustomEvent('event-to-host', { detail: { id: this.app_id, command: a_command, data: a_data } });
				window.parent.document.dispatchEvent(customEvent);
			}
		
		/**
		 * Сообщение для Unity.
		 * 
		 * @param	a_command	Команда/событие.
		 * @param	a_data		Передаваемые данные.
		 */
			sendToUnity(a_command, a_data = '')
			{
				this.unity_instance.SendMessage('SingleApp', a_command, a_data);
			}
		
		/**
		 * Переключение полноэкранного режима.
		 * 
		 * @param	a_is_fullscreen		True для перехода в полноэкранный режим, false для выхода из него.
		 */
			setFullScreenMode(a_is_fullscreen)
			{
				// для Electron-приложений и хоста:
				this.sendToHost('setFullScreenMode', { is_fullscreen: a_is_fullscreen });
				if (this.unity_instance && typeof this.unity_instance.SetFullscreen === 'function') {
					try {
						this.unity_instance.SetFullscreen(a_is_fullscreen ? 1 : 0);
					} catch(e) {
						console.warn('[CUnityAPI] SetFullscreen error:', e);
					}
				}
			}
		
	}

/* #################################################################################################### */
/**
 * IFrame-версия:
 */

	// API:
		window.configUnity	= new CUnityAPI();
	
	// Масштабируем canvas по окну приложения:
		var _strCanvasStyle	= "position: absolute; display: block; border: none; top: 0; bottom: 0; right: 0; left: 0; margin: auto; background: white;";
		var _idCanvas		= document.querySelector("#unity-canvas");
		window.addEventListener('resize', onResizeWindow, false);
		onResizeWindow(null);
	
	// Для мобильных приложений:
		if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
		// Mobile device style: fill the whole browser client area with the game canvas:
			var meta = document.createElement('meta');
			meta.name = 'viewport';
			meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
			document.getElementsByTagName('head')[0].appendChild(meta);
		}
	
	// Оценим размер IndexedDB-баз приложения:
		// сохранённые игровые настройки:
		window.configUnity.browser_vars.files_idb_size	= 0;
		window.configUnity.calcIndexedDBSize("/idbfs").then((a_size) => {
				window.configUnity.browser_vars.files_idb_size	= a_size;
			});
		// кэш ассетов:
		window.configUnity.browser_vars.cache_idb_size	= 0;
		window.configUnity.calcIndexedDBSize("UnityCache").then((a_size) => {
				window.configUnity.browser_vars.cache_idb_size	= a_size;
			});
	
	// Оповещаем основное приложение о старте:
		//window.configUnity.sendToHost('eventWebviewInit', 'ok');
		window.configUnity.sendToHost('onAppInitStart', 'ok');
	
	/* --------------------------------------------------------- */
	/**
	 * Оповещения от основного приложения.
	 */
	/* --------------------------------------------------------- */
	
	/**
	 * Инициализация Unity-приложения.
	 * 
	 * @param	a_data	Переменные среды.
	 */
		function initUnityApp(a_data)
		{
			if (window.configUnity.is_init)
				return;// уже;
			
			window.configUnity.is_init		= true;
			window.configUnity.initBrowserVars(a_data);
			
			//window.configUnity.sendToHost('eventWebviewInitComplete', 'ok');
			window.configUnity.sendToHost('onAppInitComplete', null);
		
		// Загрузка приложения:
			createUnityInstance(_idCanvas, {
				dataUrl:			"Build/" + _strAppName + ".data.unityweb" + _strHash,
				frameworkUrl:		"Build/" + _strAppName + ".framework.js.unityweb" + _strHash,
				codeUrl:			"Build/" + _strAppName + ".wasm.unityweb" + _strHash,
				streamingAssetsUrl:	"StreamingAssets",
				companyName:		"Mersibo",
				productName:		_strAppName,
				productVersion:		"1.0",
				backgroundColor:	"#FFFFFF",
				autoSyncPersistentDataPath: true,// без этой настройки Unity-6000 больше не синхронизирует сохранения в IndexedDB;
				cacheControl:		function (a_url) {
				
					// если кэш отключён (для локальных сборок):
					if (!_fCache)
						return "no-store";
					
					// файл версии всегда актуальный:
					if (a_url.match(/version.xml/))
						return "no-store";
					
					// кэшируем игровые бандлы по последней версии (и xml игры):
					if (a_url.match(/\.bundle/) || a_url.match(/\.xml/)) {
						// этот функционал в Unity сейчас похоже не работает, версия на ассетах в IndexedDB 
						// никогда не меняется, так что пока также как с библиотечными ассетами:
						//return "must-revalidate";
						return "immutable";
					}
					
					// кэшируем библиотечные ресурсы без проверки версии:
					// если нужно обновление - обязательно менять их имена!
					if (a_url.match(/\.mp3/) || a_url.match(/\.png/)) {
						return "immutable";
					}
					
					// остальное - без кэша:
					return "no-store";
				},
			}, (progress) => {
				// Передаём реальный прогресс Unity в локальную оболочку.
				window.configUnity.sendToHost('onLoadingProgress', { progress: progress });
			}).then((a_unityInstance) => {
			
				window.configUnity.unity_instance = a_unityInstance;
			
			}).catch((a_message) => {
			
				//alert(a_message);
				//window.configUnity.sendToHost('eventWebviewOnError', a_message);
				window.configUnity.sendToHost('onError', {error: a_message });
				
			
			});
		}
	
	/**
	 * Оповещения от основного приложения.
	 * 
	 * @param	data	Данные команды { command:string, data:any }.
	 */
	 	function sendToWebview(a_data)
		{
			switch (a_data.command)
			{
			case 'init':
				
					initUnityApp(a_data.data);
				
				return;
			
			case 'onPrintComplete':
				
					window.configUnity.sendToUnity('jsOnPrintComplete');
				
				return;
			
			case 'sleep':
				
					if (!window.configUnity.is_in_sleep) {
						window.configUnity.is_in_sleep	= true;
						window.configUnity.sendToUnity('jsSleep');
						/*
						это было нужно, для выхода с экрана, для отсутствующих в сборке игр:
						if (!_apiIsErrors)
							window.configUnity.unity_instance.SendMessage("SingleApp", "jsStopGame");
						else// в случае ошибок выходим сразу:
							unityOnGameStopped(0);*/
					}
				
				return;
			
			case 'startGame':
				
					if (window.configUnity.is_in_sleep)
						return;
					
					// избранные игры: json { fav_games_ids: [3, 47...] }
					if (window.configUnity.favourite_games_ids == null || 
						window.configUnity.favourite_games_ids == undefined || 
						window.configUnity.favourite_games_ids.length == 0) {
						// fix для бага в Unity где пустой массив криво распаковывался:
						window.configUnity.favourite_games_ids	= [0];
					}
					
					window.configUnity.sendToUnity('jsFavGamesIDs', 
												   JSON.stringify({ fav_games_ids: window.configUnity.favourite_games_ids.toString() }));
					
					// args: json { game_id, game_params, game_unic_params, is_game_new }
					window.configUnity.sendToUnity('jsStartGame', a_data.data);
					_idCanvas.focus();
				
				return;
			
			case 'updateBrowserVars':
				
					window.configUnity.initBrowserVars(a_data.data);
					_idCanvas.focus();
				
				return;
			
			case 'wakeup':
				
					if (window.configUnity.is_in_sleep) {
						window.configUnity.is_in_sleep	= false;
						window.configUnity.sendToUnity('jsWakeUp');
					}
					
					_idCanvas.blur();
					_idCanvas.focus();
				
				return;
			}
		}
	
	/**
	 * Масштабирование окна Unity-приложения.
	 * 
	 * @param	event	Событие.
	 */
		function onResizeWindow(event)
		{
		/*
			Масштабирование тепеь всегда на 100%.
			Правильное положение окна камеры и тп. теперь делает Unity.
		 */
			_idCanvas.setAttribute('style', `${_strCanvasStyle} width: 100%; height: 100%;`);
		}
	
	// раскоментарить, если нужен запуск со страницы сайта:
//	initUnityApp({ base_url: "", url: "", public_url: "", favourite_games_ids: null, is_dev_mode: false, is_full_screen: false });

// Экспортируем функции для использования хостом:
	window.sendToWebview = sendToWebview;
	window.initUnityApp = initUnityApp;

/* #################################################################################################### */

/* ========== ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ UNITY C# -> JS BRIDGE ========== */
/* Unity вызывает эти функции из C# через jslib                        */

// Не переопределяем обработчики, уже установленные локальной index.html:
// они дополнительно обновляют интерфейс загрузки и не должны падать при ошибке Unity.
window.onUnityGetBrowserVars    = window.onUnityGetBrowserVars    || function()                     { return window.configUnity.getBrowserVars(); };
window.onUnityAppStarted        = window.onUnityAppStarted        || function()                     { window.configUnity.onAppStarted(); };
window.onUnityAppActivated      = window.onUnityAppActivated      || function()                     { window.configUnity.onAppActivated(); };
window.onUnityAppExit           = window.onUnityAppExit           || function()                     { window.configUnity.onAppExit(); };
window.onUnityAppExitComplete   = window.onUnityAppExitComplete   || function()                     { window.configUnity.onAppExitComplete(); };
window.onUnityError             = window.onUnityError             || function(a_msg)                { window.configUnity.onAppError(a_msg); };
window.onUnityLog               = window.onUnityLog               || function(a_msg, a_warn)        { window.configUnity.onAppLog(a_msg, a_warn); };
window.onUnityGameStarted       = window.onUnityGameStarted       || function(a_id)                 { window.configUnity.onGameStarted(a_id); };
window.onUnityGameOver          = window.onUnityGameOver          || function(a_id, a_res, a_unic) { window.configUnity.onGameOver(a_id, a_res, a_unic); };
window.onUnityGameStop          = window.onUnityGameStop          || function()                     { window.configUnity.onGameStop(); };
window.onUnityGameStopped       = window.onUnityGameStopped       || function()                     { window.configUnity.onGameStopped(); };
window.onUnitySetFullScreenMode = window.onUnitySetFullScreenMode || function(a_fs)                 { window.configUnity.setFullScreenMode(a_fs); };
window.onUnityClearAppCache     = window.onUnityClearAppCache     || function(a_f, a_c)             { window.configUnity.clearAppCache(a_f, a_c); };
window.onUnityPrintGameDoc      = window.onUnityPrintGameDoc      || function(a_id, a_url, a_p)    { if(window.configUnity.printGameDoc) window.configUnity.printGameDoc(a_id, a_url, a_p); };
