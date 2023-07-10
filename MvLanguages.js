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
 * @type boolean
 * @desc Set true forever generate the json language files to start app. When you deploy the game or do you want change the text on json, change to false.
 * @default true
 *
 * @param ImagesSwitchLanguage
 * @type boolean
 * @desc Set true to check if exists an image with {name}_{language}, this will be done asynchronously and may have a bad impact when displaying images.
 * @default false
 *
 * @help
 * ============================================================================
 *  __  __       _
 * |  \/  |     | |
 * | \  / |_   _| |     __ _ _ __   __ _ _   _  __ _  __ _  ___  ___
 * | |\/| \ \ / / |    / _` | '_ \ / _` | | | |/ _` |/ _` |/ _ \/ __|
 * | |  | |\ V /| |___| (_| | | | | (_| | |_| | (_| | (_| |  __/\__ \
 * |_|  |_| \_/ |______\__,_|_| |_|\__, |\__,_|\__,_|\__, |\___||___/
 *                                  __/ |             __/ |
 *                                 |___/             |___/
 * ============================================================================
 * Version 1.0 - 2023/07/09
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

if(!Array.prototype.forEach) {
  Array.prototype.forEach = function (cbc) {
    try {
      for(var key of this)
        cbc(key);
    } catch (e) {
      try {
        for(var key in this)
          cbc(key)
      } catch (e) {}
    }
  }
}

if(!Array.prototype.map) {
  Array.prototype.map = function (cbc) {
    var arr = []
    this.forEach(function (item) { arr.push(cbc(item)); })
    return arr;
  }
}

Array.prototype.firstOrNull = function () { return this.length > 0 ? this[0] : null; }
Array.prototype.forEachIndexed = function (cbc) {
  for (var index = 0; index < this.length; index++)
    cbc(this[index], index);
}
Array.prototype.forEachAndNext = function (cbc) {
  for (var index = 0; index < this.length - 1; index++)
    cbc(this[index], this[index + 1])
}
Number.prototype.isTextCode = function () { return this == 401 || this == 102 || this == 405; }

function MvLanguageMap(language, label, languageLabel) {
  return {
    "language": language,
    "languageLabel": languageLabel,
    "label": label,
    "toString": function () { return this.language; }
  };
}

function MvAndroidFileManager() {
  return {
    "existsSync": function () { return true; },
    "mkdirSync": function (path){},
    "readdirSync": function (path){return [];},
    "writeFileSync": function (path) {},
    "readFileSync": function () { return "{}"; }
  };
}

function joinPaths(first, second) { return first + "/" + second; }
function jsonPathName(name) { return name + ".json" }

function imageExists(url, cbc) {
  var image = new Image();
  image.onload = function () { cbc(true); }
  image.onerror = function () { cbc(false); }
  image.src = url;
}


function loadLanguage(language, asc) {
  var xhr = new XMLHttpRequest();
  var url = joinPaths(_mvLanguagesFolder, jsonPathName(language));
  xhr.open('GET', url, asc);
  xhr.overrideMimeType('application/json');
  xhr.onload = function() {
    if (xhr.status < 400)
      $MvLanguages[language] = JSON.parse(xhr.responseText);
  };
  xhr.onerror = function() { };
  xhr.send();
}


function mapLanguage(json) { return MvLanguageMap(json["language"], json["label"], json["languageLabel"]); }
function mapLanguages(params) { return JSON.parse(params["Languages"]).map(function (item) { return mapLanguage(JSON.parse(item)) }); }

var _mvParams = PluginManager.parameters('MvLanguages') || {};
var _defaultLanguage = MvLanguageMap("default", "English", "Language")
var _mvLanguages = _mvParams["Languages"] ? mapLanguages(_mvParams) : [_defaultLanguage];
var _isMobile = !Utils.isNwjs()
var _langKey = MvLanguageMap("MvLanguage", "Language", "")
var _mvLanguageIndex = 0;
var _mvLanguagesFolder = "data/languages"
var _mvDefaultFile = joinPaths(_mvLanguagesFolder, jsonPathName(_defaultLanguage));
var _mvLanguage = _defaultLanguage;
var _mvJsonLanguage = {};
var _loggerFile = joinPaths(_mvLanguagesFolder, "logger.txt");
var $MvLanguages = {};

function fileManager(){ return _isMobile ? MvAndroidFileManager() : require("fs"); }
function plusChangeLanguage() {
  if (_mvLanguageIndex === _mvLanguages.length - 1) _mvLanguageIndex = 0;
  else _mvLanguageIndex++;
  _mvLanguage = _mvLanguages[_mvLanguageIndex]
}


function getLanguage(lang) { return $MvLanguages[lang] ? $MvLanguages[lang] : null; }
function loadLanguages(asc) { _mvLanguages.forEach(function (item) { loadLanguage(item.language, asc); }); }
function booleanParam(key) { return _mvParams[key] === "true"; }
function generateFiles() {
  var fs = fileManager();

  function generateInitialFile() {
    if (!fs.existsSync(_mvLanguagesFolder)) fs.mkdirSync(_mvLanguagesFolder);
    _mvJsonLanguage = {
      title: $dataSystem.gameTitle,
      terms: $dataSystem.terms,
      equip_types: $dataSystem.equipTypes,
      skill_types: $dataSystem.skillTypes,
      weapon_types: $dataSystem.weaponTypes,
      actors: [],
      armors: [],
      classes: [],
      common_events: [],
      enemies: [],
      items: [],
      skills: [],
      states: [],
      troops: [],
      weapons: [],
      map_data: {}
    };

    $dataActors.forEachAndNext(function (_, next) {
      _mvJsonLanguage.actors.push({
        name: next.name,
        nickname: next.nickname,
        profile: next.profile
      });
    });
    $dataArmors.forEachAndNext(function (_, next) {
      _mvJsonLanguage.armors.push({
        name: next.name,
        description: next.description
      });
    });
    $dataClasses.forEachAndNext(function (_, next) { _mvJsonLanguage.classes.push(next.name); });
    $dataEnemies.forEachAndNext(function (_, next) { _mvJsonLanguage.enemies.push(next.battlerName); });
    $dataItems.forEachAndNext(function (_, next) {
      _mvJsonLanguage.items.push({
        name: next.name,
        description: next.description
      });
    });
    $dataSkills.forEachAndNext(function (_, next) {
      _mvJsonLanguage.skills.push({
        name: next.name,
        description: next.description,
        message1: next.message1,
        message2: next.message2
      });
    });
    $dataStates.forEachAndNext(function (_, next) {
      _mvJsonLanguage.states.push({
        name: next.name,
        description: next.description,
        message1: next.message1,
        message2: next.message2,
        message3: next.message3,
        message4: next.message4
      });
    });
    $dataTroops.forEachAndNext(function (_, next) {
      if(!next)
        return;
      var troop = {name: next.name, pages: []};
      next.pages.forEach(function (page) {
        if(!page)
          return;
        var pages = []
        page.list.forEachIndexed(function (cmd, cIndex) {
          if(!cmd)
            return;
          if(cmd.code.isTextCode())
            pages.push({index: cIndex, parameters: cmd.parameters});
        })
        troop.pages.push(pages);
      });
      _mvJsonLanguage.troops.push(troop);
    });
    $dataCommonEvents.forEachAndNext(function (_, next) {
      if(!next)
        return;
      var ce = {messages: []};
      next.list.forEachIndexed(function (cmd, cIndex) {
        if(!cmd)
          return;
        if(cmd.code.isTextCode())
          ce.messages.push({index: cIndex, parameters: cmd.parameters});
      });
      _mvJsonLanguage.common_events.push(ce);
    });
    $dataWeapons.forEachAndNext(function (_, next) {
      _mvJsonLanguage.weapons.push({
        name: next.name,
        description: next.description
      });
    });

    var files = fs.readdirSync("data");
    files.forEach(function (file) {
      if (!file.startsWith("Map") || isNaN(file.substr(3, 3)) || file.startsWith("MapInfos")) return;
      var json = JSON.parse(fs.readFileSync("data/" + file));
      var messages = [];

      json.events.forEachAndNext(function (_, event) {
        if(!event)
          return;
        event.pages.forEachIndexed(function (page, pIndex) {
          if(!page)
            return;
          page.list.forEachIndexed(function (cmd, cIndex) {
            if(!cmd)
              return;

            if(cmd.code.isTextCode())
              messages.push({event: event.id, page: pIndex, index: cIndex, parameters: cmd.parameters, code: cmd.code, indent: cmd.indent});
          });
        })
      });

      _mvJsonLanguage.map_data["MAP" + file.substr(3, 3)] = messages;
    });
    fs.writeFileSync(_mvDefaultFile, JSON.stringify(_mvJsonLanguage))
  }

  generateInitialFile();

  var json = getLanguage(_defaultLanguage.language) || _mvJsonLanguage;
  if(json) {
    _mvLanguages.forEach(function (lang) {
      var path = joinPaths(_mvLanguagesFolder, jsonPathName(lang))
      fs.writeFileSync(path, JSON.stringify(json));
    });

  }
}

function MvUpdateLanguageData() {

  if (!ConfigManager[_langKey.language])
    ConfigManager[_langKey.language] = _mvLanguageIndex;

  _mvLanguageIndex = parseInt(ConfigManager[_langKey.language])
  _mvLanguage = _mvLanguages[_mvLanguageIndex];

  if(!_mvLanguage)
    _mvLanguage = _mvLanguages.firstOrNull()

  if(!_mvLanguage)
    return;

  _mvJsonLanguage = getLanguage(_mvLanguage.language)

  if(!_mvJsonLanguage)
    return;

  _langKey.languageLabel = _mvLanguage.languageLabel;

  $dataSystem.gameTitle = _mvJsonLanguage.title;
  $dataSystem.terms = _mvJsonLanguage.terms;
  $dataSystem.weaponTypes = _mvJsonLanguage.weapon_types;
  $dataSystem.equipTypes = _mvJsonLanguage.equip_types;
  $dataSystem.skillTypes = _mvJsonLanguage.skill_types;

  _mvJsonLanguage.actors.forEachIndexed(function (item, index) {
    $dataActors[index + 1].name = item.name;
    $dataActors[index + 1].nickname = item.nickname;
    $dataActors[index + 1].profile = item.profile;
  });
  _mvJsonLanguage.armors.forEachIndexed(function (item, index) {
    $dataArmors[index + 1].name = item.name;
    $dataArmors[index + 1].description = item.description;
  })
  _mvJsonLanguage.classes.forEachIndexed(function (item, index) {
    $dataClasses[index + 1].name = item;
  });
  _mvJsonLanguage.common_events.forEachIndexed(function (item, index) {
    item.messages.forEach(function (message) {
      $dataCommonEvents[index + 1].list[message.index].parameters = message.parameters;
    });
  });
  _mvJsonLanguage.enemies.forEachIndexed(function (item, index) {
    $dataEnemies[index + 1].name = item;
  });
  _mvJsonLanguage.items.forEachIndexed(function (item, index) {
    $dataItems[index + 1].name = item.name;
    $dataItems[index + 1].description = item.description;
  });
  _mvJsonLanguage.skills.forEachIndexed(function (item, index) {
    $dataSkills[index + 1].name = item.name;
    $dataSkills[index + 1].description = item.description;
    $dataSkills[index + 1].message1 = item.message1;
    $dataSkills[index + 1].message2 = item.message2;
  });
  _mvJsonLanguage.states.forEachIndexed(function (item, index) {
    $dataStates[index + 1].name = item.name;
    $dataStates[index + 1].description = item.description;
    $dataStates[index + 1].message1 = item.message1;
    $dataStates[index + 1].message2 = item.message2;
    $dataStates[index + 1].message3 = item.message3;
    $dataStates[index + 1].message4 = item.message4;
    $dataStates[index + 1].message5 = item.message5;
  });
  _mvJsonLanguage.troops.forEachIndexed(function (item, index) {
    item.pages.forEachIndexed(function (page, tIndex) {
      page.forEach(function (value) {
        $dataTroops[index + 1].pages[tIndex].list[value.index].parameters = value.parameters;
      });
    });
  });
  _mvJsonLanguage.weapons.forEachIndexed(function (item, index) {
    $dataWeapons[index + 1].name = item.name;
    $dataWeapons[index + 1].description = item.description;
  });


}

function mvMain() {
  var _start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    if(!DataManager.isBattleTest() && !DataManager.isEventTest()) {
      if(!_isMobile && booleanParam("GenerateLanguagesFiles"))
        generateFiles();
      loadLanguages(false);
      MvUpdateLanguageData();
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
    this.MvLanguage = this.readLanguage(config, _langKey.language);
    _apply_data.call(this, config);
  };

  ConfigManager.readLanguage = function(config, name) { return config[name]; };

  var _onMapLoaded = Scene_Map.prototype.onMapLoaded;

  Scene_Map.prototype.onMapLoaded = function() {
    _onMapLoaded.call(this);
    var data = _mvJsonLanguage.map_data["MAP" + $gameMap.mapId().padZero(3)]
    if (data) {
      data.forEach(function (item) {
        $dataMap.events[item.event].pages[item.page].list[item.index].parameters = item.parameters;
      })

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