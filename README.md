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
This parameter is a list of structures. Each element will have two required values and one optional value.
* **language**: A text to be used as the language identifier and also as the name of the .json file to be generated. Its required.
* **label**: A text to be used as the value to display in the options menu when the selected language is changed, I recommend to put the name of the language (English, Español, etc). Its required.
* **labelLanguage**: A text to be used as the value to display in the options menu as the value for the language option. I recommend using the language translation to the language to be added (Language, Idioma, etc). Default value is Language.

### GenerateLanguagesFiles

This parameter is a combo options. According to the option chosen, the language files will be generated or not.
* **IfNotExist**: Generate the language files only if they do not exist.
* **Ever**: Always generates the language files. Is the default value.
* **Never**: Does not generate language files.

Keep in mind to change the value to IfNotExist or Never before doing any editing to the language .json files or before deploying the project.

### JoinShowTextValues

This parameter is a boolean value, if set to true, all command objects with code 401 (show text) will be traits as one and their first parameter will me joined with \n as separator. You can view an example [here](#joined-show-text)

### ImagesSwitchLanguage

This parameter is a boolean value, if set to true a request will be made asynchronously to check if a file with _{language}.png at the end of the name exists in the pictures folder before displaying an image from that folder.
This may cause some lag when displaying images, especially on low-end android devices.


## Language files

The language files is a json file with the language as name. And have a structure with small keys so that their weight is smaller, since in large projects there can be a great impact if the keys are of large size as parameters.

### Joined show text

In the commonEvents or map### object inside the language file, there may be objects with a key **lt**, this is produced because command objects with code 401 have been joined (first parameter of each). and **lt** indicates how many objects have been joined. The main reason I added this is to try to reduce the size of the generated file.

For example, with this:
```json5
/*....*/
{
  "code": 401,
  "indent": 1,
  "parameters": [
    "\\n<\\N[1]>[I've got the perfect idea!\\! I just need to liven things up"
  ]
},
{
  "code": 401,
  "indent": 1,
  "parameters": [
    "to boost the team's morale.!]"
  ]
}
/*....*/
```
If JoinShowTextValues is true, this is produced:
```json5
/*....*/
{
 "e": 0,
 "i": 8,
 "pg": 15,
 "ps": [
     "\\n<\\N[1]>[I've got the perfect idea!\\! I just need to liven things up \nto boost the team's morale.!]"
   ],
 "lt": 2
}
/*....*/
```

If JoinShowTextValues is false, this is produced:
```json
/*....*/
{
  "e": 0,
  "i": 8,
  "pg": 15,
  "ps": [
    "\\n<\\N[1]>[I've got the perfect idea!\\! I just need to spice things up in order "
  ]
},
{
  "e": 0,
  "i": 9,
  "pg": 15,
  "ps": [
    "for her to see the fun in this too!]"
  ]
}
/*....*/
```

## About

This plugin was developed from NozakiYouu's DuckieMultipleLanguage plugin. It has modifications for android device support. It was tested with a basic configuration (without images) in RPG Maker MV version 1.6.1 on both pc and android (5.1>).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Problems

If you encounter any problems or bugs while using the script, please open an issue in the GitHub repository.

Thanks for using my script! If you have any questions or suggestions, feel free to contact me.
