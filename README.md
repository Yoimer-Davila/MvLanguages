# MvLanguages

```
============================================================================
 __  __       _
|  \/  |     | |
| \  / |_   _| |     __ _ _ __   __ _ _   _  __ _  __ _  ___  ___
| |\/| \ \ / / |    / _` | '_ \ / _` | | | |/ _` |/ _` |/ _ \/ __|
| |  | |\ V /| |___| (_| | | | | (_| | |_| | (_| | (_| |  __/\__ \
|_|  |_| \_/ |______\__,_|_| |_|\__, |\__,_|\__,_|\__, |\___||___/
                                 __/ |             __/ |
                                |___/             |___/
============================================================================
```

MvLanguages is a plugin for multiple language support in rpg maker games. It is based on NozakiYouu's plugin [DuckieMultipleLanguage](https://github.com/NozakiYuu/DuckieMultipleLanguage).

## Usage

To use the plugin copy the MvLanguages.js file into the plugin folder of your project and activate it in the plugin manager section of RPG Maker MV. 
Then configure the necessary parameters to generate and use the files for the languages.

## Plugin Parameters

There are some necessary parameters that need to be configured.

### Languages 
This parameter is a list of structures. Each element will have two mandatory values and one optional value.
* **language**: A text to be used as the language identifier and also as the name of the .json file to be generated. Its required.
* **label**: A text to be used as the value to display in the options menu when the selected language is changed, I recommend to put the name of the language (English, Español, etc). Its required.
* **labelLanguage**: A text to be used as the value to display in the options menu as the value for the language option. I recommend using the language translation to the language to be added (Language, Language, etc). Default value is Language.

### GenerateLanguagesFiles

This parameter is a boolean value, if it is set to true all the .json files of the languages will always be generated. It must be changed to false before deploying the project.

All languages .json files will be generated in data/languages folder.

Keep in mind to change the value to false before doing any editing to the language .json files.

### ImagesSwitchLanguage

This parameter is a boolean value, if set to true a request will be made asynchronously to check if a file with _{language}.png at the end of the name exists in the pictures folder before displaying an image from that folder.
This may cause some lag when displaying images, especially on low-end android devices.


## About

This plugin was developed from NozakiYouu's DuckieMultipleLanguage plugin. It has modifications for android device support. It was tested with a basic configuration (without images) in RPG Maker MV version 1.6.1 on both pc and android (5.1>).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Problems

If you encounter any problems or bugs while using the script, please open an issue in the GitHub repository.

Thanks for using my script! If you have any questions or suggestions, feel free to contact me.