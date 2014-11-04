Seminarium
==========
Temat pracy: Internetowa aplikacja geoinformacyjna przeznaczona dla urządzeń wyposażonych w odbiorniki systemu GPS.

Linki:

Bazy danych
http://pouchdb.com/

GUI takie jak natywne
http://ionicframework.com/docs/components/

Do wyświetlania map offline
http://leafletjs.com/

Do generowania kafelków
http://mobac.sourceforge.net/

Należy 
1. wybrać atlas typu osmdroid ZIP 
2. wygenerować zip z kafelkami na danym obszarze
3. rozpakować go w folderze images
4. podmienić TileLayer w leaflet na 
'images/seminarium_atlas/MapQuest/{z}/{x}/{y}.jpg'

