//=============================================================================
// MvLanguages.js
//=============================================================================

/*~struct~LanguageMap:
* @param language
* @type string
* @desc the language key value
* @param label
* @type string
* @desc the language label value which will as label on game options when it is selected
* @param languageLabel
* @type string
* @desc the language label value which will as label on game options when it is selected
* @default Language
*/
/*:
 * @plugindesc
 * Add multiple languages support for RPG Maker MV games based on Serena1432 DuckieMultipleLanguage plugin.
 * @author Davila Yoimer

 * @param Languages
 * @type struct<LanguageMap>[]
 * @desc A list with the languages that game will support.
 * @default ["{\"language\": \"default\", \"label\":\"English\", \"languageLabel\":\"Language\"}"]
 *
 * @param GenerateLanguagesFiles
 * @type combo
 * @option IfNotExist
 * @option Ever
 * @option Never
 * @desc Select an option for the generation of .json language files. It's only generated in PC version.
 * @default Ever
 *
 * @param JoinShowTextValues
 * @type boolean
 * @desc Set true to join the show text (code 401) command objects.
 * @default true
 *
 * @param ImagesSwitchLanguage
 * @type boolean
 * @desc Set true to check if exists an image with {name}_{language}, this will be done asynchronously and may have a bad impact when displaying images.
 * @default false
 *
 * @help
 * =============================================================================
 *  __  __       _
 * |  \/  |     | |
 * | \  / |_   _| |     __ _ _ __   __ _ _   _  __ _  __ _  ___  ___
 * | |\/| \ \ / / |    / _` | '_ \ / _` | | | |/ _` |/ _` |/ _ \/ __|
 * | |  | |\ V /| |___| (_| | | | | (_| | |_| | (_| | (_| |  __/\__ \
 * |_|  |_| \_/ |______\__,_|_| |_|\__, |\__,_|\__,_|\__, |\___||___/
 *                                  __/ |             __/ |
 *                                 |___/             |___/
 * =============================================================================
 * Plugin parameters
 * "Languages"
 * This parameter is a list of structures.
 * Each element will have two required values and one optional value.
 * * language: A text to be used as the language identifier and also as the name
 * of the .json file to be generated.
 *
 * * label: A text to be used as the value to display in the options menu when
 * the selected language is changed, I recommend to put the name of the
 * language (English, Español, etc).
 *
 * * labelLanguage: A text to be used as the value to display in the options
 * menu as the value for the language option. I recommend using the language
 * translation to the language to be added (Language, Idioma, etc).
 *
 *
 * "GenerateLanguagesFiles"
 * This parameter is a combo options. According to the option chosen,
 * the language files will be generated or not.
 * * IfNotExist: Generate the language files only if they do not exist.
 * * Ever: Always generates the language files
 * * Never: Does not generate language files
 * Keep in mind to change the value to IfNotExist or Never before doing
 * any editing to the language .json files or before deploying the project.
 *
 *
 * "ImagesSwitchLanguage"
 * This parameter is a boolean value, if set to true a request will be made
 * asynchronously to check if a file with _{language}.png at the end of the name
 * exists in the pictures folder before displaying an image from that folder.
 * This may cause some lag when displaying images,
 * especially on low-end android devices.
 *
 *
 * Language files
 * The .json files that are generated have a structure with small keys so that
 * their weight is smaller, since in large projects there can be a great impact
 * if the keys are of large size as parameters.
 * The file are located in /data/languages
 *
 * In addition, objects with the key "lt", is an object created from other objects
 * with code 401 (show text), as shown below:
 * {
 *   "code": 401,
 *   "indent": 1,
 *   "parameters": [
 *     "\\n<\\N[1]>[I've got the perfect idea!\\! I just need to liven things up"
 *   ]
 * },
 * {
 *   "code": 401,
 *   "indent": 1,
 *   "parameters": [
 *     "to boost the team's morale.!]"
 *   ]
 * }
 *
 * Produce:
 * {
 *   "e": 0,
 *   "i": 8,
 *   "pg": 15,
 *   "ps": [
 *     "\\n<\\N[1]>[I've got the perfect idea!\\! I just need to liven things up
 *     \nto boost the team's morale.!]"
 *   ],
 *   "lt": 2
 * }
 *
 * In these, the value of "lt" indicates how many objects parameter have been
 * joined to form the first ps item. Each value of the first parameter of the
 * objects is joined with "\n" as a separator. Remember to keep the
 * number of "\n" in "lt" - 1. (and "\\n" is not equal to "\n").
 * The value of "lt" is important, since it is used for assigning values
 * in maps and common events.
 *
 * If you have problems with that, set JoinShowTextValues to false.
 *
 * IMPORTANT: You must only edit the string type values in the language files.
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * Version 1.1.5 - 2023/08/01
 * Project: https://github.com/Yoimer-Davila/MvLanguages
 * Author: Davila Yoimer
 */

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
    position = position || this.length;
    position = position - searchString.length;
    var lastIndex = this.lastIndexOf(searchString);
    return lastIndex !== -1 && lastIndex === position;
  };
}
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}
if (!String.prototype.isEmpty) {
  String.prototype.isEmpty = function () { return this.length === 0; }
}
if(!String.prototype.strip) {
  String.prototype.strip = function () { return this.replace(/^\s+|\s+$/g, '') }
}


Array.prototype.firstOrNull = function () { return this.length > 0 ? this[0] : null; }
Array.prototype.forEachIndexed = function (callback) {
  for (var index = 0; index < this.length; index++)
    callback(this[index], index);
}

if(!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback) { this.forEachIndexed(function (it, _) { callback(it); }); }
}

if(!Array.prototype.isEmpty) {
  Array.prototype.isEmpty = function () { return this.length === 0; }
}

Array.prototype.mapIfIndexed = function (callback, condition) {
  var arr = [];
  this.forEachIndexed(function (it, index) {
    if((condition && condition(it)) || (!condition && it))
      arr.push(callback(it, index))
  });
  return arr;
}

Array.prototype.mapIf = function (callback, condition) { return this.mapIfIndexed(function (it, _) { return callback(it) }, condition) }

Array.prototype.extendArray = function (arr) {
  var thisObject = this;
  arr.forEach(function (it) { thisObject.push(it) })
}

function TextCode() {}
TextCode.SHOW_TEXT = 401;
TextCode.SHOW_CHOICE =  102;
TextCode.SHOW_SCROLLING_TEXT = 405;

Number.prototype.isTextCode = function () {
  return this.valueOf() === TextCode.SHOW_TEXT || this.valueOf() === TextCode.SHOW_CHOICE || this.valueOf() === TextCode.SHOW_SCROLLING_TEXT;
}

function MvLanguageMap(language, label, languageLabel) {
  this.language = language ? language : "";
  this.label = label ? label : "";
  this.languageLabel = languageLabel ? languageLabel : "";
  this.toString = function () { return this.language; }
}

MvLanguageMap.fromJson = function (json) { return new MvLanguageMap(json["language"], json["label"], json["languageLabel"]); }

function MvAndroidFileManager() {
  this.existsSync = function () { return true; }
  this.mkdirSync = function (path){}
  this.readdirSync = function (path){return [];}
  this.writeFileSync = function (path) {}
  this.readFileSync = function () { return "{}"; }
}

function MvMini(name, index) {
  this.n = name;
  this.i = index;
}

function MvMiniActor(name, nickname, profile, index) {
  MvMini.call(this, name, index)
  this.nc = nickname;
  this.p = profile;
}
function MvActor(name, nickname, profile) {
  this.name = name;
  this.nickname = nickname;
  this.profile = profile;
  this.toMini = function () { return new MvMiniActor(this.name, this.nickname, this.profile); }
}
MvActor.fromJson = function (json) { return new MvActor(json["name"], json["nickname"], json["profile"]); }
MvActor.fromMiniJson = function (json) { return new MvActor(json["n"], json["nc"], json["p"]); }

function MvMiniItem(name, description, index) {
  MvMini.call(this, name, index);
  this.d = description;
}
function MvItem(name, description) {
  this.name = name;
  this.description = description;
  this.toMini = function () { return new MvMiniItem(this.name, this.description); }
}
MvItem.fromJson = function (json) { return new MvItem(json["name"], json["description"]); }
MvItem.fromMiniJson = function (json) { return new MvItem(json["n"], json["d"]); }

function MvMiniSkill(name, description, message1, message2) {
  MvMiniItem.call(this, name, description);
  this.ms1 = message1;
  this.ms2 = message2;
}
function MvSkill(name, description, message1, message2) {
  MvItem.call(this, name, description);
  this.message1 = message1;
  this.message2 = message2;
  this.toMini = function () { return new MvMiniSkill(this.name, this.description, this.message1, this.message2); }
}
MvSkill.fromJson = function (json) { return new MvSkill(json["name"], json["description"], json["message1"], json["message2"]) }
MvSkill.fromMiniJson = function (json) { return new MvSkill(json["n"], json["d"], json["ms1"], json["ms2"]) }

function MvMiniState(name, description, message1, message2, message3, message4) {
  MvMiniSkill.call(this, name, description, message1, message2);
  this.ms3 = message3;
  this.ms4 = message4;
}
function MvState(name, description, message1, message2, message3, message4) {
  MvSkill.call(this, name, description, message1, message2);
  this.message3 = message3;
  this.message4 = message4;
  this.toMini = function () { return new MvMiniState(this.name, this.description, this.message1, this.message2, this.message3, this.message4); }
}
MvState.fromJson = function (json) { return new MvState(json["name"], json["description"], json["message1"], json["message2"], json["message3"], json["message4"]) }
MvState.fromMiniJson = function (json) { return new MvState(json["n"], json["d"], json["ms1"], json["ms2"], json["ms3"], json["ms4"]) }

function MvMiniCommand(event, page, index, parameters) {
  this.e = event;
  this.i = index;
  this.pg = page;
  this.ps = parameters;
  this.lt = undefined;
  this.joinParameters = function () {
    if(this.ps.length > 1) {
      this.lt = this.ps.length;
      this.ps = [this.ps.join("\n")];
    }
    return this;
  }
}
function MvCommand(event, page, index, parameters) {
  this.event = event;
  this.index = index;
  this.page = page;
  this.parameters = parameters;
  this.length = this.parameters.length;
  this.toMini = function () { return new MvMiniCommand(this.event, this.page, this.index, this.parameters); }
}
MvCommand.fromMiniJson = function (json) {
  var command = new MvCommand(json["e"], json["pg"], json["i"], json["ps"]);
  command.length = json["lt"];
  return command;
}
function MvMiniMap(displayName, messages) {
  this.dn = displayName ? displayName : "";
  this.mss = messages ? messages : [];
}
function MvMap(displayName, messages) {
  this.displayName = displayName ? displayName : "";
  this.messages = messages ? messages : [];
}
MvMap.fromMiniJson = function (json) { return new MvMap(json["dn"], json["mss"]); }
function MvMiniTroop(name, pages) {
  this.n = name;
  this.pgs = pages;
}
function MvTroop(name, pages) {
  this.name = name;
  this.pages = pages ? pages : [];
}
MvTroop.fromMiniJson = function (json) { return new MvTroop(json["n"], json["pgs"]); }
function MvMiniCommon(messages) {
  this.mss = messages;
}
function MvCommon(messages) {
  this.messages = messages ? messages : [];
}
MvCommon.fromMiniJson = function (json) { return new MvCommon(json["mss"]); }
function MvEvent(id, pages) {
  this.id = id;
  this.pages = pages ? pages : [];
}
function defaultMvCommand() { return new MvCommand(-1, -1, -1, []) }

function mapCommandEvent(event) {
  var command = defaultMvCommand();
  var messages = []
  function pushCommand() {
    if (command.parameters.isEmpty())
      return;
    messages.push(command.toMini().joinParameters());
    command = defaultMvCommand();
  }
  event.pages.forEachIndexed(function (page, pIndex) {
    if(!page)
      return;
    page.list.forEachIndexed(function (cmd, cIndex) {
      if(!cmd)
        return;
      if(cmd.code.isTextCode()) {
        if(cmd.code.valueOf() === TextCode.SHOW_TEXT && booleanParam("JoinShowTextValues")) {
          if(command.parameters.isEmpty()) {
            command.event = event.id;
            command.page = pIndex;
            command.index = cIndex;
          }
          command.parameters.push(cmd.parameters[0]);
        } else {
          if(booleanParam("JoinShowTextValues"))
            pushCommand();
          messages.push(new MvMiniCommand(event.id, pIndex, cIndex, cmd.parameters));
        }
      } else pushCommand();
    });
  });
  return messages;
}

function assignCommand(page, events){
  if(!page)
    return
  page.forEach(function (value) {
    var reducer = 0;
    value = MvCommand.fromMiniJson(value);

    if(value.length) {
      value.parameters[0].split("\n").forEachIndexed(function (it, index) {
        if(it.strip().isEmpty()) {
          reducer += 1
          return
        }

        index -= reducer
        if(index < value.length)
          events[value.event].pages[value.page].list[value.index + index].parameters[0] = it
      })
    }
    else events[value.event].pages[value.page].list[value.index].parameters = value.parameters
  })
}

function MvLanguage() {
  this.title = $dataSystem.gameTitle;
  this.terms = $dataSystem.terms;
  this.equipTypes = $dataSystem.equipTypes;
  this.skillTypes = $dataSystem.skillTypes;
  this.weaponTypes = $dataSystem.weaponTypes;
  this.classes = $dataClasses.mapIf(function (it) { return it.name; })
  this.actors = $dataActors.mapIf(function (it) { return MvActor.fromJson(it).toMini(); });
  this.enemies = $dataEnemies.mapIf(function (it) { return it.battlerName; })
  this.troops = $dataTroops.mapIf(function (it) { return new MvMiniTroop(it.name, [mapCommandEvent(it)]); })
  this.weapons = $dataWeapons.mapIf(function (it) { return MvItem.fromJson(it).toMini(); });
  this.armors = $dataArmors.mapIf(function (it) { return MvItem.fromJson(it).toMini(); });
  this.items = $dataItems.mapIf(function (it) { return MvItem.fromJson(it).toMini(); });
  this.skills = $dataSkills.mapIf(function (it) { return MvSkill.fromJson(it).toMini(); });
  this.states = $dataStates.mapIf(function (it) { return MvState.fromJson(it).toMini(); });
  this.commonEvents = new MvMiniCommon(mapCommandEvent(new MvEvent(0, $dataCommonEvents)));
  this.maps = {};
}


function joinPaths(first, second) { return first + "/" + second; }
function jsonPathName(name) { return name + ".json" }

function imageExists(url, callback) {
  var image = new Image();
  image.onload = function () { callback(true); }
  image.onerror = function () { callback(false); }
  image.src = url;
}


function loadLanguage(language, asc, callback) {
  var xhr = new XMLHttpRequest();
  var url = joinPaths(_mvLanguagesFolder, jsonPathName(language));
  xhr.open('GET', url, asc);
  xhr.overrideMimeType('application/json');
  xhr.onload = function() {
    if (xhr.status < 400)
      callback(xhr.responseText);
  };
  xhr.onerror = function() { };
  xhr.send();
}


function mapLanguage(json) { return MvLanguageMap.fromJson(json); }
function mapLanguages(params) { return JSON.parse(params["Languages"]).mapIf(function (item) { return mapLanguage(JSON.parse(item)) }); }

var _mvParams = PluginManager.parameters('MvLanguages') || {};
var _defaultLanguage = new MvLanguageMap("default", "English", "Language")
var _mvLanguages = _mvParams["Languages"] ? mapLanguages(_mvParams) : [_defaultLanguage];
var _isMobile = !Utils.isNwjs()
var _langKey = new MvLanguageMap("MvLanguage", "Language", "")
var _mvLanguageIndex = 0;
var _mvLanguagesFolder = "data/languages"
var _mvDefaultFile = joinPaths(_mvLanguagesFolder, jsonPathName(_defaultLanguage));
var _mvLanguage = _defaultLanguage;
var _mvJsonLanguage = null;
var _loggerFile = joinPaths(_mvLanguagesFolder, "logger.txt");
var $MvLanguages = {};

function fileManager(){ return _isMobile ? new MvAndroidFileManager() : require("fs"); }
function plusChangeLanguage() {
  if (_mvLanguageIndex === _mvLanguages.length - 1) _mvLanguageIndex = 0;
  else _mvLanguageIndex++;
  _mvLanguage = _mvLanguages[_mvLanguageIndex]
}


function getLanguage(lang) { return $MvLanguages[lang] ? $MvLanguages[lang] : null; }
function assignLanguage(language, fileResult) { $MvLanguages[language] = JSON.parse(fileResult); }
function loadLanguages(asc) {
  _mvLanguages.forEach(function (item) {
    if(item.language !== _mvLanguage.language)
      loadLanguage(item.language, asc, function (result) { assignLanguage(item.language, result) });
  });
}
function booleanParam(key) { return _mvParams[key] === "true"; }
function generateOption() { return _mvParams["GenerateLanguagesFiles"]; }
function everGenerate() { return generateOption() === "Ever" }
function generateIfNotExist() { return generateOption() === "IfNotExist" }
function neverGenerate() { return generateOption() === "Never"; }
function generateFiles() {
  var fs = fileManager();

  function generateInitialFile() {
    if (!fs.existsSync(_mvLanguagesFolder)) fs.mkdirSync(_mvLanguagesFolder);
    _mvJsonLanguage = new MvLanguage();
    fs.readdirSync("data").forEach(function (file) {
      if (!file.startsWith("Map") || file.startsWith("MapInfos") || !file.endsWith(".json")) return;
      var mapNum = file.substr(3, 3);
      if(isNaN(mapNum)) return;
      var json = JSON.parse(fs.readFileSync("data/" + file));
      var messages = [];
      json.events.forEach(function (event) {
        if(!event)
          return;
        messages.extendArray(mapCommandEvent(event))
      })
      _mvJsonLanguage.maps["map" + mapNum] = new MvMiniMap(json.displayName, messages);
    });
    fs.writeFileSync(_mvDefaultFile, JSON.stringify(_mvJsonLanguage))
  }
  if((generateIfNotExist() && !fs.existsSync(_mvDefaultFile)) || everGenerate())
    generateInitialFile();

  var json = getLanguage(_defaultLanguage.language) || _mvJsonLanguage;
  if(json) {
    _mvLanguages.forEach(function (lang) {
      var path = joinPaths(_mvLanguagesFolder, jsonPathName(lang))
      if((generateIfNotExist() && !fs.existsSync(path)) || everGenerate())
        fs.writeFileSync(path, JSON.stringify(json));
    });
  }
}

function currentLanguageMap() {
  if (!ConfigManager[_langKey.language])
    ConfigManager[_langKey.language] = _mvLanguageIndex;

  _mvLanguageIndex = parseInt(ConfigManager[_langKey.language])
  _mvLanguage = _mvLanguages[_mvLanguageIndex];

  if(!_mvLanguage)
    _mvLanguage = _mvLanguages.firstOrNull()

}

function MvUpdateLanguageData() {
  currentLanguageMap()
  if(!_mvLanguage)
    return;
  _mvJsonLanguage = getLanguage(_mvLanguage.language)

  if(!_mvJsonLanguage)
    return;

  _langKey.languageLabel = _mvLanguage.languageLabel;

  $dataSystem.gameTitle = _mvJsonLanguage.title;
  $dataSystem.terms = _mvJsonLanguage.terms;
  $dataSystem.weaponTypes = _mvJsonLanguage.weaponTypes;
  $dataSystem.equipTypes = _mvJsonLanguage.equipTypes;
  $dataSystem.skillTypes = _mvJsonLanguage.skillTypes;

  _mvJsonLanguage.actors.forEachIndexed(function (item, index) { Object.assign($dataActors[index + 1], MvActor.fromMiniJson(item)); });
  _mvJsonLanguage.armors.forEachIndexed(function (item, index) { Object.assign($dataArmors[index + 1], MvItem.fromMiniJson(item)); });
  _mvJsonLanguage.classes.forEachIndexed(function (item, index) { $dataClasses[index + 1].name = item; });
  _mvJsonLanguage.enemies.forEachIndexed(function (item, index) { $dataEnemies[index + 1].battlerName = item; });
  _mvJsonLanguage.items.forEachIndexed(function (item, index) {  Object.assign($dataItems[index + 1], MvItem.fromMiniJson(item)); });
  _mvJsonLanguage.skills.forEachIndexed(function (item, index) { Object.assign($dataSkills[index + 1], MvSkill.fromMiniJson(item)); });
  _mvJsonLanguage.states.forEachIndexed(function (item, index) { Object.assign($dataStates[index + 1], MvState.fromMiniJson(item)); });
  _mvJsonLanguage.weapons.forEachIndexed(function (item, index) { Object.assign($dataWeapons[index + 1], MvItem.fromMiniJson(item));  });
  assignCommand(MvCommon.fromMiniJson(_mvJsonLanguage.commonEvents).messages, [{pages: $dataCommonEvents}]);
  _mvJsonLanguage.troops.forEach(function (item) {
    MvTroop.fromMiniJson(item).pages.forEach(function (page) { assignCommand(page, $dataTroops) });
  });


}

function mvMain() {
  var _start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    if(!DataManager.isBattleTest() && !DataManager.isEventTest()) {
      if(!_isMobile && !neverGenerate())
        generateFiles();
      currentLanguageMap()
      loadLanguage(_mvLanguage.language, true, function (result) {
        assignLanguage(_mvLanguage.language, result);
        MvUpdateLanguageData();
      })
      loadLanguages(true);
    }
    _start.call(this)
  };
  var _statusText = Window_Options.prototype.statusText;
  Window_Options.prototype.statusText = function(index) {
    return this.commandSymbol(index).endsWith(_langKey.label) ? _mvLanguage.label : _statusText.call(this, index);
  };

  var _add_general_options = Window_Options.prototype.addGeneralOptions;
  Window_Options.prototype.addGeneralOptions = function() {
    _add_general_options.call(this);
    this.addCommand(_langKey.languageLabel, _langKey.language);
  };

  var _processOk = Window_Options.prototype.processOk;
  Window_Options.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (symbol.endsWith(_langKey.label)) {
      plusChangeLanguage();
      this.changeValue(symbol, _mvLanguageIndex);
    } else _processOk.call(this)
  };
  var _cursorLeft = Window_Options.prototype.cursorLeft;
  Window_Options.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (symbol.endsWith(_langKey.label)) {
      if (_mvLanguageIndex === 0) _mvLanguageIndex = _mvLanguages.length - 1;
      else _mvLanguageIndex--;
      _mvLanguage = _mvLanguages[_mvLanguageIndex]
      this.changeValue(symbol, _mvLanguageIndex);
    } else _cursorLeft.call(this, wrap);
  };
  var _cursorRight = Window_Options.prototype.cursorRight;
  Window_Options.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (symbol.endsWith(_langKey.label)) {
      plusChangeLanguage();
      this.changeValue(symbol, _mvLanguageIndex);
    } else _cursorRight.call(this, wrap);
  };

  var _title_create = Scene_Title.prototype.create;
  Scene_Title.prototype.create = function() {
    MvUpdateLanguageData();
    _title_create.call(this);
  }

  var _titleStart = Scene_Title.prototype.start;
  Scene_Title.prototype.start = function () {
    MvUpdateLanguageData();
    _titleStart.call(this);
  }

  var _menu_create = Scene_MenuBase.prototype.create;
  Scene_MenuBase.prototype.create = function() {
    MvUpdateLanguageData();
    _menu_create.call(this);
  };
  var _make_data = ConfigManager.makeData;
  ConfigManager.makeData = function() {
    var config = _make_data.call(this);
    config.MvLanguage = this.MvLanguage;
    return config;
  };
  var _apply_data = ConfigManager.applyData;
  ConfigManager.applyData = function(config) {
    this.MvLanguageMap = this.readLanguage(config, _langKey.language);
    _apply_data.call(this, config);
  };

  ConfigManager.readLanguage = function(config, name) { return config[name]; };

  var _onMapLoaded = Scene_Map.prototype.onMapLoaded;

  Scene_Map.prototype.onMapLoaded = function() {
    _onMapLoaded.call(this);
    var map = _mvJsonLanguage.maps["map" + $gameMap.mapId().padZero(3)]
    if(map) {
      map = MvMap.fromMiniJson(map);
      $dataMap.displayName = map.displayName;
      assignCommand(map.messages, $dataMap.events);
    }
  };

  var _showPicture = Game_Screen.prototype.showPicture;
  Game_Screen.prototype.showPicture = function(pictureId, name, origin, x, y,
                                               scaleX, scaleY, opacity, blendMode) {
    var thisObj = this;
    if(booleanParam("ImagesSwitchLanguage"))
      imageExists(joinPaths("img/pictures", name + "_" + _mvLanguage + ".png"), function (exist) {
        if(exist)
          name = name + "_" + _mvLanguage;
        _showPicture.call(thisObj, pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode);
      })
    else _showPicture.call(thisObj, pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode)

  };
}

mvMain();