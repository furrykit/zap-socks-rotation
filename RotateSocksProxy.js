var Model = Java.type("org.parosproxy.paros.model.Model");
var ScriptVars = Java.type("org.zaproxy.zap.extension.script.ScriptVars");
var URL = Java.type("java.net.URL");
var HttpURLConnection = Java.type("java.net.HttpURLConnection");
var InputStreamReader = Java.type("java.io.InputStreamReader");
var BufferedReader = Java.type("java.io.BufferedReader");
var StandardCharsets = Java.type("java.nio.charset.StandardCharsets");

var proxyList = [
    "socks5://127.0.0.1:60000", "socks5://127.0.0.1:60001", "socks5://127.0.0.1:60002",
    "socks5://127.0.0.1:60003", "socks5://127.0.0.1:60004", "socks5://127.0.0.1:60005",
    "socks5://127.0.0.1:60006", "socks5://127.0.0.1:60007", "socks5://127.0.0.1:60008",
    "socks5://127.0.0.1:60009", "socks5://127.0.0.1:60010", "socks5://127.0.0.1:60011",
    "socks5://127.0.0.1:60012", "socks5://127.0.0.1:60013", "socks5://127.0.0.1:60014",
    "socks5://127.0.0.1:60015", "socks5://127.0.0.1:60016", "socks5://127.0.0.1:60017",
    "socks5://127.0.0.1:60018", "socks5://127.0.0.1:60019", "socks5://127.0.0.1:60020",
    "socks5://127.0.0.1:60021", "socks5://127.0.0.1:60022", "socks5://127.0.0.1:60023",
    "socks5://127.0.0.1:60024", "socks5://127.0.0.1:60025", "socks5://127.0.0.1:60026",
    "socks5://127.0.0.1:60027", "socks5://127.0.0.1:60028", "socks5://127.0.0.1:60029",
    "socks5://127.0.0.1:60030", "socks5://127.0.0.1:60031", "socks5://127.0.0.1:60032",
    "socks5://127.0.0.1:60033", "socks5://127.0.0.1:60034", "socks5://127.0.0.1:60035",
    "socks5://127.0.0.1:60036", "socks5://127.0.0.1:60037", "socks5://127.0.0.1:60038",
    "socks5://127.0.0.1:60039", "socks5://127.0.0.1:60040", "socks5://127.0.0.1:60041",
    "socks5://127.0.0.1:60042", "socks5://127.0.0.1:60043", "socks5://127.0.0.1:60044",
    "socks5://127.0.0.1:60045", "socks5://127.0.0.1:60046", "socks5://127.0.0.1:60047",
    "socks5://127.0.0.1:60048", "socks5://127.0.0.1:60049", "socks5://127.0.0.1:60050",
    "socks5://127.0.0.1:60051", "socks5://127.0.0.1:60052", "socks5://127.0.0.1:60053",
    "socks5://127.0.0.1:60054", "socks5://127.0.0.1:60055", "socks5://127.0.0.1:60056",
    "socks5://127.0.0.1:60057", "socks5://127.0.0.1:60058", "socks5://127.0.0.1:60059",
    "socks5://127.0.0.1:60060", "socks5://127.0.0.1:60061", "socks5://127.0.0.1:60062",
    "socks5://127.0.0.1:60063", "socks5://127.0.0.1:60064", "socks5://127.0.0.1:60065",
    "socks5://127.0.0.1:60066", "socks5://127.0.0.1:60067", "socks5://127.0.0.1:60068",
    "socks5://127.0.0.1:60069", "socks5://127.0.0.1:60070", "socks5://127.0.0.1:60071",
    "socks5://127.0.0.1:60072", "socks5://127.0.0.1:60073", "socks5://127.0.0.1:60074",
    "socks5://127.0.0.1:60075", "socks5://127.0.0.1:60076", "socks5://127.0.0.1:60077",
    "socks5://127.0.0.1:60078", "socks5://127.0.0.1:60079", "socks5://127.0.0.1:60080",
    "socks5://127.0.0.1:60081", "socks5://127.0.0.1:60082", "socks5://127.0.0.1:60083",
    "socks5://127.0.0.1:60084", "socks5://127.0.0.1:60085", "socks5://127.0.0.1:60086",
    "socks5://127.0.0.1:60087", "socks5://127.0.0.1:60088", "socks5://127.0.0.1:60089",
    "socks5://127.0.0.1:60090", "socks5://127.0.0.1:60091", "socks5://127.0.0.1:60092",
    "socks5://127.0.0.1:60093", "socks5://127.0.0.1:60094", "socks5://127.0.0.1:60095",
    "socks5://127.0.0.1:60096", "socks5://127.0.0.1:60097", "socks5://127.0.0.1:60098",
    "socks5://127.0.0.1:60099", "socks5://127.0.0.1:60100"
];
var PROXY_CHANGE_INTERVAL = 10; // Rotation inteval
var HARDCODED_API_KEY = "YOUR_API_KEY"; // Replace with your api key

var PROXY_INDEX_KEY = "proxy.rotator.index.v98";
var REQUEST_COUNTER_KEY = "proxy.rotator.counter.v98";
var zapApiKey = null;
var zapApiBaseUrl = null;
var SCRIPT_NAME = "RotateSocksProxy";
var SCRIPT_VERSION = "[v9.8]";

function log(message) {
    print(SCRIPT_NAME + " " + SCRIPT_VERSION + ": " + message);
}

function logError(message, e) {
    print(SCRIPT_NAME + " " + SCRIPT_VERSION + ": !!! ERROR: " + message);
    if (e) {
        print("  Exception: " + e);
        if (e.javaException) {
            e.javaException.printStackTrace();
        } else if (e.stack) {
            print("  Stack: " + e.stack);
        }
    }
}

function initApiParams() {
    if (zapApiBaseUrl) { return true; }
    if (!HARDCODED_API_KEY) {
        logError("API key is empty!");
        return false;
    }
    zapApiKey = HARDCODED_API_KEY;
    try {
        var options = Model.getSingleton().getOptionsParam();
        var proxyParam = options.getProxyParam();
        var zapPort = proxyParam.getProxyPort();
        zapApiBaseUrl = "http://127.0.0.1:" + zapPort;
        log("API parameters initialized. API URL: " + zapApiBaseUrl);
        return true;
    } catch (e) {
        logError("CRITICAL ERROR during API initialization", e);
        zapApiBaseUrl = null;
        zapApiKey = null;
        return false;
    }
}

function callZapApi(component, type, name, params) {
    if (!zapApiBaseUrl || !zapApiKey) {
        logError("Cannot call ZAP API - not initialized.");
        return false;
    }
    var apiUrlString = zapApiBaseUrl + "/JSON/" + component + "/" + type + "/" + name + "/?" + params;
    var connection = null;
    var success = false;
    var responseBodyStr = "";
    try {
        var url = new URL(apiUrlString);
        connection = url.openConnection(java.net.Proxy.NO_PROXY);
        connection.setRequestMethod("GET");
        connection.setRequestProperty("X-ZAP-API-Key", zapApiKey);
        connection.setConnectTimeout(5000);
        connection.setReadTimeout(10000);
        connection.setUseCaches(false);
        var statusCode = connection.getResponseCode();
        if (statusCode >= 200 && statusCode < 300) {
            success = true;
        } else {
            log("API call failed " + name + ". Status: " + statusCode);
            var errorStream = connection.getErrorStream();
            if (errorStream != null) {
                try {
                    var reader = new BufferedReader(new InputStreamReader(errorStream, StandardCharsets.UTF_8));
                    var responseLine;
                    var responseBody = new java.lang.StringBuilder();
                    while ((responseLine = reader.readLine()) != null) {
                        responseBody.append(responseLine);
                    }
                    reader.close();
                    responseBodyStr = responseBody.toString();
                    log("  Error response: " + responseBodyStr);
                } catch (eRead) {
                    log("  Failed to read error body: " + eRead);
                }
            }
        }
    } catch (e) {
        logError("CRITICAL ERROR calling ZAP API (" + name + ")", e);
        success = false;
    } finally {
        if (connection != null) {
            try { connection.disconnect(); } catch (eDisc) { }
        }
    }
    return success;
}

function sendingRequest(msg, initiator, helper) {
     if (proxyList.length === 0) { return; }
     if (!initApiParams()) {
         log("API init failed. Proxy not changed.");
         return;
     }

     var nextProxyIndexStr = ScriptVars.getGlobalVar(PROXY_INDEX_KEY);
     var requestCounterStr = ScriptVars.getGlobalVar(REQUEST_COUNTER_KEY);

     var nextProxyIndex = 0;
     var requestCounter = 0;

     if (nextProxyIndexStr !== null) {
         var parsedIndex = parseInt(nextProxyIndexStr);
         if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < proxyList.length) {
             nextProxyIndex = parsedIndex;
         }
     }
     if (requestCounterStr !== null) {
         var parsedCounter = parseInt(requestCounterStr);
         if (!isNaN(parsedCounter) && parsedCounter >= 0) {
             requestCounter = parsedCounter;
         }
     }

     if (requestCounter === 0) {
         log("Counter reset. Attempting to set proxy #" + nextProxyIndex);
         var proxyStringToSet = proxyList[nextProxyIndex];
         var host = "";
         var port = -1;

         try {
             var schemeMatch = proxyStringToSet.match(/^socks5:\/\//);
             if (!schemeMatch) {
                 logError("Not a SOCKS5 URI: " + proxyStringToSet + ". Skipping change.");
                 return;
             }
             var hostPortString = proxyStringToSet.substring(schemeMatch[0].length);
             var hostPort = hostPortString.split(":");
             if (hostPort.length !== 2) {
                 logError("Error parsing host:port: " + hostPortString + ". Skipping change.");
                 return;
             }
             host = hostPort[0];
             port = parseInt(hostPort[1]);
             if (isNaN(port) || port <= 0 || port > 65535) {
                 logError("Error parsing port: " + hostPort[1] + ". Skipping change.");
                 return;
             }

             var paramsSetProxy = "host=" + encodeURIComponent(host) +
                                  "&port=" + port +
                                  "&version=5" +
                                  "&useDns=false";

             var setProxySuccess = callZapApi('network', 'action', 'setSocksProxy', paramsSetProxy);
             var setEnabledSuccess = false;
             if (setProxySuccess) {
                 setEnabledSuccess = callZapApi('network', 'action', 'setSocksProxyEnabled', 'enabled=true');
             }

             if (setProxySuccess && setEnabledSuccess) {
                 log("Successfully set proxy via API [" + nextProxyIndex + "]: SOCKS5 " + host + ":" + port);
                 var indexAfterNextChange = (nextProxyIndex + 1) % proxyList.length;
                 ScriptVars.setGlobalVar(PROXY_INDEX_KEY, String(indexAfterNextChange));
                 log("Next proxy to be set is #" + indexAfterNextChange);
             } else {
                 logError("Failed to set proxy via API for [" + nextProxyIndex + "]: setProxy=" + setProxySuccess + ", setEnabled=" + setEnabledSuccess + ". Retrying same proxy next cycle.");
             }
         } catch (e) {
             logError("CRITICAL ERROR in proxy change block", e);
         }
     }

     requestCounter++;
     if (requestCounter >= PROXY_CHANGE_INTERVAL) {
         requestCounter = 0;
     }
     ScriptVars.setGlobalVar(REQUEST_COUNTER_KEY, String(requestCounter));
}

function responseReceived(msg, initiator, helper) {
}

function scriptAdded(script) {
    log("Script added and enabled (Change every " + PROXY_CHANGE_INTERVAL + " requests).");
     if (ScriptVars.getGlobalVar(PROXY_INDEX_KEY) == null) {
         ScriptVars.setGlobalVar(PROXY_INDEX_KEY, "0");
         log("Initialized proxy index to 0.");
     }
     if (ScriptVars.getGlobalVar(REQUEST_COUNTER_KEY) == null) {
         ScriptVars.setGlobalVar(REQUEST_COUNTER_KEY, "0");
         log("Initialized request counter to 0 (will change proxy on first request).");
     }
     initApiParams();
}

function scriptRemoved(script) {
    log("Script removed or disabled.");
    zapApiKey = null;
    zapApiBaseUrl = null;
}
