# The Publication Configurator
> [!TIP]
> To get a better understanding of the interaction between the individual artifacts, it is recommended to read ["Big Picture"](https://github.com/officialgazette/big-picture) first.

The publication configurator is used for simple type configuration using a graphical user interface. A configuration file of a tenant can be imported and edited in the tool.
```mermaid

%%{
  init: {
    'theme': 'neutral'
  }
}%%

block-beta
columns 4
  pubType["Publication
type"] space
block:scope:2
configTool["Tenant
configurator
tool"]
termsConfig["Terms
configurator
tool"]
end
space:6
block:outOfScope:2
Config["Configuration
file"]
termDB[("
Terms
catalog")]
end


Config--"save/load"-->configTool
configTool-->Config
termDB-->configTool
outOfScope--"configures"-->pubType
termsConfig-->termDB
termDB--"save/load"-->termsConfig



style scope stroke:#f66,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
style outOfScope stroke:grey,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
```

${\color{red}----}$ Scope of this repository

${\color{grey}----}$ Out of scope (for the publication configuration server see repository [here](https://github.com/officialgazette/publication-configurator-server))

## Tenant configuration tool
The configuration tool can create/edit a JSON file that configures the publication types. This JSON file must be loaded into the publication configuration server.
![Screenshot Config Tool](https://amtsblattportal.ch/static/media/screenshot_config_ui.PNG)

The screenshot above shows the config screen of the tool. The left-hand side lists the publication types of the general terms catalog, while the right-hand side shows the tenant-specific configuration.
## Terms configuration tool
The terms configuration tool can create/edit a JSON file (referred as "Terms Database") which defines the standard publications types, the standard terms (Elements) and their assignment to them.

![Screenshot terms db](https://amtsblattportal.ch/static/media/screenshot_terms_db2.PNG)

The created/edited JSON file must then be loaded into the publication configuration server, see Repository [here](https://github.com/officialgazette/publication-configurator-server)). Note: For security reasons, there is no connection between the publication type configurator tools and the publication configuration server. The created/edited JSON files are added manually to the productive server environment. The JSON files are stored in the browser cache only.

>[!TIP]
> To try out the configuration tools, we recommend using the sample JSON files from the standards repository and load them into the online publication type configurator at the following URLs:
> * Tenant configurator tool: https://nextgen.amtsblattportal.ch/terms/ui
>   
>   **Note:** A terms catalog file must first be imported (s. below). A tenant-specific configuration can then be made from scratch.
>
> * Terms configurator tool: https://nextgen.amtsblattportal.ch/terms/ui/root
>
>   A sample terms catalog file can be downloaded here: https://nextgen.amtsblattportal.ch/terms
