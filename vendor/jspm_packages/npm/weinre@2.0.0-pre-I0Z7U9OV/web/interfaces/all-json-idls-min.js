/* */ 
"format cjs";
modjewel.require('weinre/common/Weinre').addIDLs([{"interfaces": [{"name": "InjectedScriptHost", "methods": [{"name": "clearConsoleMessages", "parameters": []}, {"name": "copyText", "parameters": [{"name": "text"}]}, {"parameters": [{"name": "nodeId"}], "name": "nodeForId"}, {"parameters": [{"name": "node"}, {"name": "withChildren"}, {"name": "selectInUI"}], "name": "pushNodePathToFrontend"}, {"name": "inspectedNode", "parameters": [{"name": "num"}]}, {"parameters": [{"name": "object"}], "name": "internalConstructorName"}, {"parameters": [], "name": "currentCallFrame"}, {"parameters": [{"name": "database"}], "name": "selectDatabase"}, {"parameters": [{"name": "storage"}], "name": "selectDOMStorage"}, {"name": "didCreateWorker", "parameters": [{"name": "id"}, {"name": "url"}, {"name": "isFakeWorker"}]}, {"name": "didDestroyWorker", "parameters": [{"name": "id"}]}, {"name": "nextWorkerId", "parameters": []}]}], "name": "core"}, {"interfaces": [{"name": "Inspector", "methods": [{"name": "addScriptToEvaluateOnLoad", "parameters": [{"name": "scriptSource"}]}, {"name": "removeAllScriptsToEvaluateOnLoad", "parameters": []}, {"name": "reloadPage", "parameters": [{"name": "ignoreCache"}]}, {"name": "populateScriptObjects", "parameters": []}, {"name": "openInInspectedWindow", "parameters": [{"name": "url"}]}, {"name": "setSearchingForNode", "parameters": [{"name": "enabled"}]}, {"name": "didEvaluateForTestInFrontend", "parameters": [{"name": "testCallId"}, {"name": "jsonResult"}]}, {"name": "highlightDOMNode", "parameters": [{"name": "nodeId"}]}, {"name": "hideDOMNodeHighlight", "parameters": []}, {"name": "highlightFrame", "parameters": [{"name": "frameId"}]}, {"name": "hideFrameHighlight", "parameters": []}, {"name": "setUserAgentOverride", "parameters": [{"name": "userAgent"}]}, {"name": "getCookies", "parameters": []}, {"name": "deleteCookie", "parameters": [{"name": "cookieName"}, {"name": "domain"}]}, {"name": "startTimelineProfiler", "parameters": []}, {"name": "stopTimelineProfiler", "parameters": []}, {"name": "enableDebugger", "parameters": []}, {"name": "disableDebugger", "parameters": []}, {"name": "enableProfiler", "parameters": []}, {"name": "disableProfiler", "parameters": []}, {"name": "startProfiling", "parameters": []}, {"name": "stopProfiling", "parameters": []}]}, {"name": "Runtime", "methods": [{"name": "evaluate", "parameters": [{"name": "expression"}, {"name": "objectGroup"}, {"name": "includeCommandLineAPI"}]}, {"name": "getCompletions", "parameters": [{"name": "expression"}, {"name": "includeCommandLineAPI"}]}, {"name": "getProperties", "parameters": [{"name": "objectId"}, {"name": "ignoreHasOwnProperty"}, {"name": "abbreviate"}]}, {"name": "setPropertyValue", "parameters": [{"name": "objectId"}, {"name": "propertyName"}, {"name": "expression"}]}, {"name": "releaseWrapperObjectGroup", "parameters": [{"name": "injectedScriptId"}, {"name": "objectGroup"}]}]}, {"name": "InjectedScript", "methods": [{"name": "evaluateOnSelf", "parameters": [{"name": "functionBody"}, {"name": "argumentsArray"}]}]}, {"name": "Console", "methods": [{"name": "setConsoleMessagesEnabled", "parameters": [{"name": "enabled"}]}, {"name": "clearConsoleMessages", "parameters": []}, {"name": "setMonitoringXHREnabled", "parameters": [{"name": "enabled"}]}]}, {"name": "Network", "methods": [{"name": "cachedResources", "parameters": []}, {"name": "resourceContent", "parameters": [{"name": "frameId"}, {"name": "url"}, {"name": "base64Encode"}]}, {"name": "setExtraHeaders", "parameters": [{"name": "headers"}]}]}, {"name": "Database", "methods": [{"name": "getDatabaseTableNames", "parameters": [{"name": "databaseId"}]}, {"name": "executeSQL", "parameters": [{"name": "databaseId"}, {"name": "query"}]}]}, {"name": "DOMStorage", "methods": [{"name": "getDOMStorageEntries", "parameters": [{"name": "storageId"}]}, {"name": "setDOMStorageItem", "parameters": [{"name": "storageId"}, {"name": "key"}, {"name": "value"}]}, {"name": "removeDOMStorageItem", "parameters": [{"name": "storageId"}, {"name": "key"}]}]}, {"name": "ApplicationCache", "methods": [{"name": "getApplicationCaches", "parameters": []}]}, {"name": "DOM", "methods": [{"name": "getChildNodes", "parameters": [{"name": "nodeId"}]}, {"name": "setAttribute", "parameters": [{"name": "elementId"}, {"name": "name"}, {"name": "value"}]}, {"name": "removeAttribute", "parameters": [{"name": "elementId"}, {"name": "name"}]}, {"name": "setTextNodeValue", "parameters": [{"name": "nodeId"}, {"name": "value"}]}, {"name": "getEventListenersForNode", "parameters": [{"name": "nodeId"}]}, {"name": "copyNode", "parameters": [{"name": "nodeId"}]}, {"name": "removeNode", "parameters": [{"name": "nodeId"}]}, {"name": "changeTagName", "parameters": [{"name": "nodeId"}, {"name": "newTagName"}]}, {"name": "getOuterHTML", "parameters": [{"name": "nodeId"}]}, {"name": "setOuterHTML", "parameters": [{"name": "nodeId"}, {"name": "outerHTML"}]}, {"name": "addInspectedNode", "parameters": [{"name": "nodeId"}]}, {"name": "performSearch", "parameters": [{"name": "query"}, {"name": "runSynchronously"}]}, {"name": "searchCanceled", "parameters": []}, {"name": "pushNodeByPathToFrontend", "parameters": [{"name": "path"}]}, {"name": "resolveNode", "parameters": [{"name": "nodeId"}]}, {"name": "getNodeProperties", "parameters": [{"name": "nodeId"}, {"name": "propertiesArray"}]}, {"name": "getNodePrototypes", "parameters": [{"name": "nodeId"}]}, {"name": "pushNodeToFrontend", "parameters": [{"name": "objectId"}]}]}, {"name": "CSS", "methods": [{"name": "getStylesForNode", "parameters": [{"name": "nodeId"}]}, {"name": "getComputedStyleForNode", "parameters": [{"name": "nodeId"}]}, {"name": "getInlineStyleForNode", "parameters": [{"name": "nodeId"}]}, {"name": "getAllStyles", "parameters": []}, {"name": "getStyleSheet", "parameters": [{"name": "styleSheetId"}]}, {"name": "getStyleSheetText", "parameters": [{"name": "styleSheetId"}]}, {"name": "setStyleSheetText", "parameters": [{"name": "styleSheetId"}, {"name": "text"}]}, {"name": "setPropertyText", "parameters": [{"name": "styleId"}, {"name": "propertyIndex"}, {"name": "text"}, {"name": "overwrite"}]}, {"name": "toggleProperty", "parameters": [{"name": "styleId"}, {"name": "propertyIndex"}, {"name": "disable"}]}, {"name": "setRuleSelector", "parameters": [{"name": "ruleId"}, {"name": "selector"}]}, {"name": "addRule", "parameters": [{"name": "contextNodeId"}, {"name": "selector"}]}, {"name": "getSupportedCSSProperties", "parameters": []}, {"name": "querySelectorAll", "parameters": [{"name": "documentId"}, {"name": "selector"}]}]}, {"name": "Timeline", "methods": []}, {"name": "Debugger", "methods": [{"name": "activateBreakpoints", "parameters": []}, {"name": "deactivateBreakpoints", "parameters": []}, {"name": "setJavaScriptBreakpoint", "parameters": [{"name": "url"}, {"name": "lineNumber"}, {"name": "columnNumber"}, {"name": "condition"}, {"name": "enabled"}]}, {"name": "setJavaScriptBreakpointBySourceId", "parameters": [{"name": "sourceId"}, {"name": "lineNumber"}, {"name": "columnNumber"}, {"name": "condition"}, {"name": "enabled"}]}, {"name": "removeJavaScriptBreakpoint", "parameters": [{"name": "breakpointId"}]}, {"name": "continueToLocation", "parameters": [{"name": "sourceId"}, {"name": "lineNumber"}, {"name": "columnNumber"}]}, {"name": "stepOver", "parameters": []}, {"name": "stepInto", "parameters": []}, {"name": "stepOut", "parameters": []}, {"name": "pause", "parameters": []}, {"name": "resume", "parameters": []}, {"name": "editScriptSource", "parameters": [{"name": "sourceID"}, {"name": "newContent"}]}, {"name": "getScriptSource", "parameters": [{"name": "sourceID"}]}, {"name": "setPauseOnExceptionsState", "parameters": [{"name": "pauseOnExceptionsState"}]}, {"name": "evaluateOnCallFrame", "parameters": [{"name": "callFrameId"}, {"name": "expression"}, {"name": "objectGroup"}, {"name": "includeCommandLineAPI"}]}, {"name": "getCompletionsOnCallFrame", "parameters": [{"name": "callFrameId"}, {"name": "expression"}, {"name": "includeCommandLineAPI"}]}]}, {"name": "BrowserDebugger", "methods": [{"name": "setAllBrowserBreakpoints", "parameters": [{"name": "breakpoints"}]}, {"name": "setDOMBreakpoint", "parameters": [{"name": "nodeId"}, {"name": "type"}]}, {"name": "removeDOMBreakpoint", "parameters": [{"name": "nodeId"}, {"name": "type"}]}, {"name": "setEventListenerBreakpoint", "parameters": [{"name": "eventName"}]}, {"name": "removeEventListenerBreakpoint", "parameters": [{"name": "eventName"}]}, {"name": "setXHRBreakpoint", "parameters": [{"name": "url"}]}, {"name": "removeXHRBreakpoint", "parameters": [{"name": "url"}]}]}, {"name": "Profiler", "methods": [{"name": "getProfileHeaders", "parameters": []}, {"name": "getProfile", "parameters": [{"name": "type"}, {"name": "uid"}]}, {"name": "removeProfile", "parameters": [{"name": "type"}, {"name": "uid"}]}, {"name": "clearProfiles", "parameters": []}, {"name": "takeHeapSnapshot", "parameters": [{"name": "detailed"}]}]}, {"name": "InspectorNotify", "methods": [{"parameters": [], "name": "frontendReused"}, {"parameters": [{"name": "nodeIds"}], "name": "addNodesToSearchResult"}, {"parameters": [], "name": "bringToFront"}, {"parameters": [], "name": "disconnectFromBackend"}, {"parameters": [{"name": "url"}], "name": "inspectedURLChanged"}, {"parameters": [{"name": "time"}], "name": "domContentEventFired"}, {"parameters": [{"name": "time"}], "name": "loadEventFired"}, {"parameters": [], "name": "reset"}, {"parameters": [{"name": "panel"}], "name": "showPanel"}, {"parameters": [{"name": "testCallId"}, {"name": "script"}], "name": "evaluateForTestInFrontend"}, {"parameters": [{"name": "nodeId"}], "name": "updateFocusedNode"}]}, {"name": "ConsoleNotify", "methods": [{"parameters": [{"name": "messageObj"}], "name": "addConsoleMessage"}, {"parameters": [{"name": "count"}], "name": "updateConsoleMessageExpiredCount"}, {"parameters": [{"name": "count"}], "name": "updateConsoleMessageRepeatCount"}, {"parameters": [], "name": "consoleMessagesCleared"}]}, {"name": "NetworkNotify", "methods": [{"parameters": [{"name": "frameId"}], "name": "frameDetachedFromParent"}, {"parameters": [{"name": "identifier"}, {"name": "url"}, {"name": "loader"}, {"name": "callStack"}], "name": "identifierForInitialRequest"}, {"parameters": [{"name": "identifier"}, {"name": "time"}, {"name": "request"}, {"name": "redirectResponse"}], "name": "willSendRequest"}, {"parameters": [{"name": "identifier"}], "name": "markResourceAsCached"}, {"parameters": [{"name": "identifier"}, {"name": "time"}, {"name": "resourceType"}, {"name": "response"}], "name": "didReceiveResponse"}, {"parameters": [{"name": "identifier"}, {"name": "time"}, {"name": "lengthReceived"}], "name": "didReceiveContentLength"}, {"parameters": [{"name": "identifier"}, {"name": "finishTime"}], "name": "didFinishLoading"}, {"parameters": [{"name": "identifier"}, {"name": "time"}, {"name": "localizedDescription"}], "name": "didFailLoading"}, {"parameters": [{"name": "time"}, {"name": "resource"}], "name": "didLoadResourceFromMemoryCache"}, {"parameters": [{"name": "identifier"}, {"name": "sourceString"}, {"name": "type"}], "name": "setInitialContent"}, {"parameters": [{"name": "frame"}, {"name": "loader"}], "name": "didCommitLoadForFrame"}, {"parameters": [{"name": "identifier"}, {"name": "requestURL"}], "name": "didCreateWebSocket"}, {"parameters": [{"name": "identifier"}, {"name": "time"}, {"name": "request"}], "name": "willSendWebSocketHandshakeRequest"}, {"parameters": [{"name": "identifier"}, {"name": "time"}, {"name": "response"}], "name": "didReceiveWebSocketHandshakeResponse"}, {"parameters": [{"name": "identifier"}, {"name": "time"}], "name": "didCloseWebSocket"}]}, {"name": "DatabaseNotify", "methods": [{"parameters": [{"name": "database"}], "name": "addDatabase"}, {"parameters": [{"name": "databaseId"}], "name": "selectDatabase"}, {"parameters": [{"name": "transactionId"}, {"name": "columnNames"}, {"name": "values"}], "name": "sqlTransactionSucceeded"}, {"parameters": [{"name": "transactionId"}, {"name": "sqlError"}], "name": "sqlTransactionFailed"}]}, {"name": "DOMStorageNotify", "methods": [{"parameters": [{"name": "storage"}], "name": "addDOMStorage"}, {"parameters": [{"name": "storageId"}], "name": "updateDOMStorage"}, {"parameters": [{"name": "storageId"}], "name": "selectDOMStorage"}]}, {"name": "ApplicationCacheNotify", "methods": [{"parameters": [{"name": "status"}], "name": "updateApplicationCacheStatus"}, {"parameters": [{"name": "isNowOnline"}], "name": "updateNetworkState"}]}, {"name": "DOMNotify", "methods": [{"parameters": [{"name": "root"}], "name": "setDocument"}, {"parameters": [{"name": "id"}, {"name": "attributes"}], "name": "attributesUpdated"}, {"parameters": [{"name": "id"}, {"name": "newValue"}], "name": "characterDataModified"}, {"parameters": [{"name": "parentId"}, {"name": "nodes"}], "name": "setChildNodes"}, {"parameters": [{"name": "root"}], "name": "setDetachedRoot"}, {"parameters": [{"name": "id"}, {"name": "newValue"}], "name": "childNodeCountUpdated"}, {"parameters": [{"name": "parentId"}, {"name": "prevId"}, {"name": "node"}], "name": "childNodeInserted"}, {"parameters": [{"name": "parentId"}, {"name": "id"}], "name": "childNodeRemoved"}]}, {"name": "TimelineNotify", "methods": [{"parameters": [], "name": "timelineProfilerWasStarted"}, {"parameters": [], "name": "timelineProfilerWasStopped"}, {"parameters": [{"name": "record"}], "name": "addRecordToTimeline"}]}, {"name": "DebuggerNotify", "methods": [{"parameters": [], "name": "debuggerWasEnabled"}, {"parameters": [], "name": "debuggerWasDisabled"}, {"parameters": [{"name": "sourceID"}, {"name": "url"}, {"name": "lineOffset"}, {"name": "columnOffset"}, {"name": "length"}, {"name": "scriptWorldType"}], "name": "parsedScriptSource"}, {"parameters": [{"name": "url"}, {"name": "data"}, {"name": "firstLine"}, {"name": "errorLine"}, {"name": "errorMessage"}], "name": "failedToParseScriptSource"}, {"parameters": [{"name": "breakpointId"}, {"name": "sourceId"}, {"name": "lineNumber"}, {"name": "columnNumber"}], "name": "breakpointResolved"}, {"parameters": [{"name": "details"}], "name": "pausedScript"}, {"parameters": [], "name": "resumedScript"}, {"parameters": [{"name": "id"}, {"name": "url"}, {"name": "isShared"}], "name": "didCreateWorker"}, {"parameters": [{"name": "id"}], "name": "didDestroyWorker"}]}, {"name": "ProfilerNotify", "methods": [{"parameters": [], "name": "profilerWasEnabled"}, {"parameters": [], "name": "profilerWasDisabled"}, {"parameters": [{"name": "header"}], "name": "addProfileHeader"}, {"parameters": [{"name": "uid"}, {"name": "chunk"}], "name": "addHeapSnapshotChunk"}, {"parameters": [{"name": "uid"}], "name": "finishHeapSnapshot"}, {"parameters": [{"name": "isProfiling"}], "name": "setRecordingProfile"}, {"parameters": [], "name": "resetProfiles"}, {"parameters": [{"name": "done"}, {"name": "total"}], "name": "reportHeapSnapshotProgress"}]}], "name": "core"}, {"interfaces": [{"name": "InspectorFrontendHost", "methods": [{"name": "loaded", "parameters": []}, {"name": "closeWindow", "parameters": []}, {"name": "disconnectFromBackend", "parameters": []}, {"name": "bringToFront", "parameters": []}, {"name": "inspectedURLChanged", "parameters": [{"name": "newURL"}]}, {"name": "requestAttachWindow", "parameters": []}, {"name": "requestDetachWindow", "parameters": []}, {"name": "setAttachedWindowHeight", "parameters": [{"name": "height"}]}, {"name": "moveWindowBy", "parameters": [{"name": "x"}, {"name": "y"}]}, {"name": "setExtensionAPI", "parameters": [{"name": "script"}]}, {"name": "localizedStringsURL", "parameters": []}, {"name": "hiddenPanels", "parameters": []}, {"name": "copyText", "parameters": [{"name": "text"}]}, {"parameters": [], "name": "platform"}, {"parameters": [], "name": "port"}, {"parameters": [{"name": "event"}, {"name": "items"}], "name": "showContextMenu"}, {"name": "sendMessageToBackend", "parameters": [{"name": "message"}]}]}], "name": "core"}, {"interfaces": [{"name": "WeinreClientCommands", "methods": [{"name": "registerClient", "parameters": []}, {"name": "getTargets", "parameters": []}, {"name": "getClients", "parameters": []}, {"name": "connectTarget", "parameters": [{"name": "clientId"}, {"name": "targetId"}]}, {"name": "disconnectTarget", "parameters": [{"name": "clientId"}]}, {"name": "getExtensions", "parameters": []}, {"name": "logDebug", "parameters": [{"name": "message"}]}, {"name": "logInfo", "parameters": [{"name": "message"}]}, {"name": "logWarning", "parameters": [{"name": "message"}]}, {"name": "logError", "parameters": [{"name": "message"}]}]}], "name": "weinre"}, {"interfaces": [{"name": "WeinreClientEvents", "methods": [{"name": "clientRegistered", "parameters": [{"name": "client"}]}, {"name": "targetRegistered", "parameters": [{"name": "target"}]}, {"name": "clientUnregistered", "parameters": [{"name": "clientId"}]}, {"name": "targetUnregistered", "parameters": [{"name": "targetId"}]}, {"name": "connectionCreated", "parameters": [{"name": "clientId"}, {"name": "targetId"}]}, {"name": "connectionDestroyed", "parameters": [{"name": "clientId"}, {"name": "targetId"}]}, {"name": "sendCallback", "parameters": [{"name": "callbackId"}, {"name": "result"}]}, {"name": "serverProperties", "parameters": [{"name": "properties"}]}]}], "name": "weinre"}, {"interfaces": [{"name": "WeinreExtraClientCommands", "methods": [{"name": "getDatabases", "parameters": []}]}], "name": "weinre"}, {"interfaces": [{"name": "WeinreExtraTargetEvents", "methods": [{"name": "databaseOpened", "parameters": [{"name": "databaseRecord"}]}]}], "name": "weinre"}, {"interfaces": [{"name": "WeinreTargetCommands", "methods": [{"name": "registerTarget", "parameters": [{"name": "url"}]}, {"name": "sendClientCallback", "parameters": [{"name": "callbackId"}, {"name": "args"}]}, {"name": "logDebug", "parameters": [{"name": "message"}]}, {"name": "logInfo", "parameters": [{"name": "message"}]}, {"name": "logWarning", "parameters": [{"name": "message"}]}, {"name": "logError", "parameters": [{"name": "message"}]}]}], "name": "weinre"}, {"interfaces": [{"name": "WeinreTargetEvents", "methods": [{"name": "connectionCreated", "parameters": [{"name": "clientId"}, {"name": "targetId"}]}, {"name": "connectionDestroyed", "parameters": [{"name": "clientId"}, {"name": "targetId"}]}, {"name": "sendCallback", "parameters": [{"name": "callbackId"}, {"name": "result"}]}]}], "name": "weinre"}])