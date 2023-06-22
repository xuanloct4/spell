// const https = require('https');
// https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
//   let data = '';
//   // A chunk of data has been recieved.
//   resp.on('data', (chunk) => {
//     data += chunk;
//   });
//   // The whole response has been received. Print out the result.
//   resp.on('end', () => {
//     console.log(JSON.parse(data).explanation);
//   });
// }).on("error", (err) => {
//   console.log("Error: " + err.message);
// });

var http = require('http');
var https = require('https');
const fs = require("fs");
var express = require('express');
var app = express();

var nspell = require('nspell');
var fullSupportedDictCodes = [
	"bg",
	"br",
	"ca",
	"ca-valencia",
	"cs",
	"cy",
	"da",
	"de",
	"de-at",
	"de-ch",
	"el",
	"el-polyton",
	"en",
	"en-au",
	"en-ca",
	"en-gb",
	"en-za",
	"eo",
	"es",
	"es-ar",
	"es-bo",
	"es-cl",
	"es-co",
	"es-cr",
	"es-cu",
	"es-do",
	"es-ec",
	"es-gt",
	"es-hn",
	"es-mx",
	"es-ni",
	"es-pa",
	"es-pe",
	"es-ph",
	"es-pr",
	"es-py",
	"es-sv",
	"es-us",
	"es-uy",
	"es-ve",
	"et",
	"eu",
	"fa",
	"fo",
	"fr",
	"fur",
	"fy",
	"ga",
	"gd",
	"gl",
	"he",
	"hr",
	"hu",
	"hy",
	"hyw",
	"ia",
	"ie",
	"is",
	"it",
	"ka",
	"ko",
	"la",
	"lb",
	"lt",
	"ltg",
	"lv",
	"mk",
	"mn",
	"nb",
	"nds",
	"ne",
	"nl",
	"nn",
	"oc",
	"pl",
	"pt",
	"pt-pt",
	"ro",
	"ru",
	"rw",
	"sk",
	"sl",
	"sr",
	"sr-latn",
	"sv",
	"sv-fi",
	"tk",
	"tlh",
	"tlh-latn",
	"tr",
	"uk",
	"vi"
];

var dictCodes = [
	"en",
	"en-gb",
	"fr",
	"vi"
];

var spells = {};
var supportedCodeIndex = -1;

console.log("Start Initializing dictionaries")
initNextDictionary();

// Add headers before the routes are defined
app.use(function (req, res, next) {
	setResponseHeader(res);

    // Pass to next layer of middleware
    next();
});
app.use(express.json())    // <==== parse request body as JSON

// app.listen(8090)

// var privateKey = fs.readFileSync("phuocphat.site-1.key", "utf8");
// var certificate = fs.readFileSync("phuocphat.site-1.crt", "utf8");
// var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);
  
httpServer.listen(8090);
// httpsServer.listen(8090);

function correctLanguageCode(code) {
	if(code === "en_us") {
		return "en";
	}

	return code;
}

app.post('/2/check', (req, res) => {
	console.log("Request -> ", '/2/check');
	const reqBody = req.body;
	console.log("Request body -> ", reqBody);
	// {"language":"de","words":["tinymce"]}

	var dictCode = reqBody.language;
	const spell = spells[correctLanguageCode(dictCode)];
	if(isRealValue(spell)) {
		var words = reqBody.words;
		var uniqueWords = words.filter(function(elem, pos) {
			return words.indexOf(elem) == pos;
		});

		var check = {};
		uniqueWords.forEach(element => {
			console.log(element, " => ", spell.correct(element));
			check[element] = spell.correct(element);
		});
		
		res = setResponseHeader(res);
		const response = {"check": check};
		console.log("Response body -> ", response);
		res.json(response);
	} else {
		console.log({"error": "no_supported_code"});
		res.json({"error": "no_supported_code"});
	}
})

app.post('/2/suggestions', (req, res) => {
	console.log("Request -> ", '/2/suggestions');
	const reqBody = req.body;
	console.log("Request body -> ", reqBody);
	// {"language":"de","words":["tinymce"]}

	var dictCode = reqBody.language;
	const spell = spells[correctLanguageCode(dictCode)];

	if(isRealValue(spell)) {
		var words = reqBody.words;
		var uniqueWords = words.filter(function(elem, pos) {
			return words.indexOf(elem) == pos;
		});
	
		
		var suggestions = {};
		uniqueWords.forEach(element => {
			const suggest = spell.suggest(element);
			console.log(element, " => ", suggest);
			if (Array.isArray(suggest) && suggest.length > 0) {
				suggestions[element] = suggest;
			}
		});
	
		res = setResponseHeader(res);
		const response = {"spell": suggestions};
		console.log("Response body -> ", response);
		res.json(response);
	} else {
		console.log({"error": "no_supported_code"});
		res.json({"error": "no_supported_code"});
	}
})

app.get('/2/autocorrect', (req, res) => {
	console.log("Request -> ", '/2/autocorrect');
	const reqBody = req.body;
	console.log("Request body -> ", reqBody);
	res = setResponseHeader(res);
	res.json({
		"corrections": {
		  "Ameria": "America",
		  "Febuary": "February",
		  "IO": "I",
		  "IU": "I",
		  "OI": "I",
		  "Wendsay": "Wednesday",
		  "Wensday": "Wednesday",
		  "abd": "and",
		  "absense": "absence",
		  "acceptible": "acceptable",
		  "accessable": "accessible",
		  "accidently": "accidentally",
		  "accomadate": "accommodate",
		  "accompanyed": "accompanied",
		  "accordingto": "according to",
		  "accross": "across",
		  "acheive": "achieve",
		  "acheived": "achieved",
		  "acheivement": "achievement",
		  "acheiving": "achieving",
		  "achievment": "achievement",
		  "acn": "can",
		  "acommodate": "accommodate",
		  "acomodate": "accommodate",
		  "acomplish": "accomplish",
		  "acquiantence": "acquaintance",
		  "acquited": "acquitted",
		  "actualy": "actually",
		  "actualyl": "actually",
		  "acuracy": "accuracy",
		  "additinal": "additional",
		  "addmission": "admission",
		  "addtional": "additional",
		  "adequit": "adequate",
		  "adequite": "adequate",
		  "adn": "and",
		  "adolecent": "adolescent",
		  "adress": "address",
		  "advanage": "advantage",
		  "adviced": "advised",
		  "aer": "are",
		  "affraid": "afraid",
		  "afterthe": "after the",
		  "aganist": "against",
		  "aggresive": "aggressive",
		  "agian": "again",
		  "agina": "again",
		  "agravate": "aggravate",
		  "agreemeent": "agreement",
		  "agreemeents": "agreements",
		  "agreemnet": "agreement",
		  "agreemnets": "agreements",
		  "agressive": "aggressive",
		  "ahd": "had",
		  "ahev": "have",
		  "ahppen": "happen",
		  "ahs": "has",
		  "ahve": "have",
		  "almots": "almost",
		  "almsot": "almost",
		  "alomst": "almost",
		  "alot": "a lot",
		  "alotted": "allotted",
		  "alraedy": "already",
		  "alreayd": "already",
		  "alreday": "already",
		  "alright": "all right",
		  "alusion": "allusion",
		  "alwasy": "always",
		  "alwats": "always",
		  "alway": "always",
		  "alwyas": "always",
		  "amature": "amateur",
		  "amd": "and",
		  "amde": "made",
		  "amke": "make",
		  "amkes": "makes",
		  "amking": "making",
		  "anbd": "and",
		  "andone": "and one",
		  "andteh": "and the",
		  "andthe": "and the",
		  "anothe": "another",
		  "anual": "annual",
		  "anytying": "anything",
		  "apparant": "apparent",
		  "apparrent": "apparent",
		  "appearence": "appearance",
		  "appeares": "appears",
		  "applicaiton": "application",
		  "applicaitons": "applications",
		  "applyed": "applied",
		  "appointiment": "appointment",
		  "approrpiate": "appropriate",
		  "approrpriate": "appropriate",
		  "april": "April",
		  "aquiantance": "acquaintance",
		  "aquire": "acquire",
		  "aquisition": "acquisition",
		  "aquisitions": "acquisitions",
		  "aquitted": "acquitted",
		  "arangement": "arrangement",
		  "arguement": "argument",
		  "arguements": "arguments",
		  "arn't": "aren't",
		  "arond": "around",
		  "artical": "article",
		  "articel": "article",
		  "asdvertising": "advertising",
		  "assistent": "assistant",
		  "asthe": "as the",
		  "atention": "attention",
		  "athat": "that",
		  "atmospher": "atmosphere",
		  "attentioin": "attention",
		  "atthe": "at the",
		  "audeince": "audience",
		  "audiance": "audience",
		  "availalbe": "available",
		  "aveh": "have",
		  "avhe": "have",
		  "awya": "away",
		  "aywa": "away",
		  "bakc": "back",
		  "balence": "balance",
		  "ballance": "balance",
		  "baout": "about",
		  "barin": "brain",
		  "bcak": "back",
		  "beacuse": "because",
		  "becasue": "because",
		  "becaus": "because",
		  "becausea": "because a",
		  "becauseof": "because of",
		  "becausethe": "because the",
		  "becauseyou": "because you",
		  "becomeing": "becoming",
		  "becomming": "becoming",
		  "becuase": "because",
		  "becuse": "because",
		  "befoer": "before",
		  "beggining": "beginning",
		  "begining": "beginning",
		  "beginining": "beginning",
		  "beleiev": "believe",
		  "beleieve": "believe",
		  "beleif": "belief",
		  "beleive": "believe",
		  "beleived": "believed",
		  "beleives": "believes",
		  "benifit": "benefit",
		  "benifits": "benefits",
		  "bera": "bear",
		  "betwen": "between",
		  "beutiful": "beautiful",
		  "boaut": "about",
		  "boxs": "boxes",
		  "brodcast": "broadcast",
		  "busness": "business",
		  "butthe": "but the",
		  "bve": "be",
		  "caharcter": "character",
		  "calcullated": "calculated",
		  "calulated": "calculated",
		  "candidtae": "candidate",
		  "candidtaes": "candidates",
		  "casion": "casino",
		  "catagory": "category",
		  "categiory": "category",
		  "ceratin": "certain",
		  "certian": "certain",
		  "challange": "challenge",
		  "challanges": "challenges",
		  "chaneg": "change",
		  "chanegs": "changes",
		  "changable": "changeable",
		  "changeing": "changing",
		  "changng": "changing",
		  "charachter": "character",
		  "charachters": "characters",
		  "charactor": "character",
		  "charecter": "character",
		  "charector": "character",
		  "chari": "chair",
		  "chasr": "characters",
		  "cheif": "chief",
		  "chekc": "check",
		  "chnage": "change",
		  "cieling": "ceiling",
		  "circut": "circuit",
		  "claer": "clear",
		  "claered": "cleared",
		  "claerer": "clearer",
		  "claerly": "clearly",
		  "clera": "clear",
		  "cliant": "client",
		  "cna": "can",
		  "colection": "collection",
		  "comanies": "companies",
		  "comany": "company",
		  "comapnies": "companies",
		  "comapny": "company",
		  "combintation": "combination",
		  "comingg": "coming",
		  "comited": "committed",
		  "comittee": "committee",
		  "commadn": "command",
		  "comming": "coming",
		  "commitee": "committee",
		  "committe": "committee",
		  "committment": "commitment",
		  "committments": "commitments",
		  "committy": "committee",
		  "comntain": "contain",
		  "comntains": "contains",
		  "compair": "compare",
		  "compleated": "completed",
		  "compleatly": "completely",
		  "compleatness": "completeness",
		  "completly": "completely",
		  "completness": "completeness",
		  "composate": "composite",
		  "comtain": "contain",
		  "comtains": "contains",
		  "comunicate": "communicate",
		  "comunity": "community",
		  "condolances": "condolences",
		  "conected": "connected",
		  "conferance": "conference",
		  "confirmmation": "confirmation",
		  "considerit": "considerate",
		  "considerite": "considerate",
		  "consonent": "consonant",
		  "conspiricy": "conspiracy",
		  "constatn": "constant",
		  "consultent": "consultant",
		  "convertable": "convertible",
		  "cooparate": "cooperate",
		  "cooporate": "cooperate",
		  "corproation": "corporation",
		  "corproations": "corporations",
		  "corruptable": "corruptible",
		  "cotten": "cotton",
		  "coudl": "could",
		  "coudln't": "couldn't",
		  "coudn't": "couldn't",
		  "couldnt": "couldn't",
		  "couldthe": "could the",
		  "cpo": "cop",
		  "cpoy": "copy",
		  "ctaegory": "category",
		  "cusotmer": "customer",
		  "cusotmers": "customers",
		  "cutsomer": "customer",
		  "cutsomers": "customers",
		  "cxan": "can",
		  "dael": "deal",
		  "danceing": "dancing",
		  "dcument": "document",
		  "deatils": "details",
		  "december": "December",
		  "decison": "decision",
		  "decisons": "decisions",
		  "defendent": "defendant",
		  "definately": "definitely",
		  "definit": "definite",
		  "deptartment": "department",
		  "deram": "dream",
		  "desicion": "decision",
		  "desicions": "decisions",
		  "deside": "decide",
		  "desision": "decision",
		  "desisions": "decision",
		  "develeoprs": "developers",
		  "devellop": "develop",
		  "develloped": "developed",
		  "develloper": "developer",
		  "devellopers": "developers",
		  "develloping": "developing",
		  "devellopment": "development",
		  "devellopments": "developments",
		  "devellops": "develops",
		  "develope": "develop",
		  "developement": "development",
		  "developements": "developments",
		  "developor": "developer",
		  "developors": "developers",
		  "develpment": "development",
		  "devide": "divide",
		  "diaplay": "display",
		  "didint": "didn't",
		  "didnot": "did not",
		  "didnt": "didn't",
		  "diea": "idea",
		  "difefrent": "different",
		  "diferences": "differences",
		  "differance": "difference",
		  "differances": "differences",
		  "differant": "different",
		  "differemt": "different",
		  "differnt": "different",
		  "diffrent": "different",
		  "directer": "director",
		  "directers": "directors",
		  "directiosn": "direction",
		  "disatisfied": "dissatisfied",
		  "discoverd": "discovered",
		  "disign": "design",
		  "dispaly": "display",
		  "dissonent": "dissonant",
		  "distribusion": "distribution",
		  "divsion": "division",
		  "do'nt": "don't",
		  "docuement": "document",
		  "docuemnt": "document",
		  "documetn": "document",
		  "documnet": "document",
		  "documnets": "documents",
		  "doens": "doesn",
		  "doens't": "doesn't",
		  "doese": "does",
		  "doesnt": "doesn't",
		  "doign": "doing",
		  "doimg": "doing",
		  "dollers": "dollars",
		  "donig": "doing",
		  "dont": "don't",
		  "dosn't": "doesn't",
		  "dreasm": "dreams",
		  "driveing": "driving",
		  "drnik": "drink",
		  "dya": "day",
		  "dyas": "days",
		  "eb": "be",
		  "ecommerce": "e-commerce",
		  "efel": "feel",
		  "effecient": "efficient",
		  "efort": "effort",
		  "eforts": "efforts",
		  "eg": "e.g.",
		  "eh": "he",
		  "ehr": "her",
		  "eles": "else",
		  "eligable": "eligible",
		  "em": "me",
		  "email": "e-mail",
		  "embarass": "embarrass",
		  "embarassing": "embarrassing",
		  "embarras": "embarrass",
		  "embarrasing": "embarrassing",
		  "ened": "need",
		  "enought": "enough",
		  "enxt": "next",
		  "equippment": "equipment",
		  "equivalant": "equivalent",
		  "erally": "really",
		  "esle": "else",
		  "especally": "especially",
		  "especialyl": "especially",
		  "espesially": "especially",
		  "ethose": "ethos",
		  "eveyr": "every",
		  "exagerate": "exaggerate",
		  "exagerated": "exaggerated",
		  "exagerating": "exaggerating",
		  "excellant": "excellent",
		  "excercise": "exercise",
		  "exchagne": "exchange",
		  "exchagnes": "exchanges",
		  "excitment": "excitement",
		  "exhcange": "exchange",
		  "existance": "existence",
		  "experiance": "experience",
		  "experienc": "experience",
		  "exprience": "experience",
		  "exprienced": "experienced",
		  "expriences": "experiences",
		  "eyar": "year",
		  "eyars": "years",
		  "eyasr": "years",
		  "eyt": "yet",
		  "faeture": "feature",
		  "faetured": "featured",
		  "faetures": "features",
		  "familair": "familiar",
		  "familar": "familiar",
		  "familliar": "familiar",
		  "fammiliar": "familiar",
		  "fe": "few",
		  "february": "February",
		  "feild": "field",
		  "feilds": "fields",
		  "fi": "if",
		  "fianlly": "finally",
		  "fidn": "find",
		  "fiel": "file",
		  "fiels": "files",
		  "finalyl": "finally",
		  "financialy": "financially",
		  "firends": "friends",
		  "firts": "first",
		  "fo": "of",
		  "follwo": "follow",
		  "follwoing": "following",
		  "fomr": "from",
		  "fora": "for a",
		  "forfiet": "forfeit",
		  "forhead": "forehead",
		  "foriegn": "foreign",
		  "forthe": "for the",
		  "forwrd": "forward",
		  "forwrds": "forwards",
		  "foudn": "found",
		  "fourty": "forty",
		  "foward": "forward",
		  "fowards": "forwards",
		  "freind": "friend",
		  "freindly": "friendly",
		  "freinds": "friends",
		  "friday": "Friday",
		  "frist": "first",
		  "frmo": "from",
		  "fro": "for",
		  "fromthe": "from the",
		  "fulfilment": "fulfillment",
		  "furneral": "funeral",
		  "fwe": "few",
		  "garantee": "guarantee",
		  "garanteed": "guaranteed",
		  "gaurd": "guard",
		  "gemeral": "general",
		  "generaly": "generally",
		  "gerat": "great",
		  "geting": "getting",
		  "gettin": "getting",
		  "gievn": "given",
		  "giveing": "giving",
		  "gloabl": "global",
		  "godo": "good",
		  "gogin": "going",
		  "goign": "going",
		  "gonig": "going",
		  "govenment": "government",
		  "goverment": "government",
		  "governer": "governor",
		  "graet": "great",
		  "grammaticaly": "grammatically",
		  "grammer": "grammar",
		  "grat": "great",
		  "greif": "grief",
		  "greta": "great",
		  "growo": "grow",
		  "gruop": "group",
		  "gruops": "groups",
		  "grwo": "grow",
		  "gte": "get",
		  "guage": "gauge",
		  "guidence": "guidance",
		  "guidlines": "guidelines",
		  "hace": "have",
		  "hadbeen": "had been",
		  "haev": "have",
		  "hapen": "happen",
		  "hapened": "happened",
		  "hapening": "happening",
		  "hapens": "happens",
		  "happend": "happened",
		  "harras": "harass",
		  "hasbeen": "has been",
		  "haveing": "having",
		  "hda": "had",
		  "hearign": "hearing",
		  "heartt": "heart",
		  "helpfull": "helpful",
		  "hera": "hear",
		  "herad": "heard",
		  "herat": "heart",
		  "heroe": "hero",
		  "heros": "heroes",
		  "hesaid": "he said",
		  "hewas": "he was",
		  "hge": "he",
		  "hieght": "height",
		  "hismelf": "himself",
		  "hlep": "help",
		  "horus": "hours",
		  "housr": "hours",
		  "hre": "her",
		  "hsa": "has",
		  "hte": "the",
		  "hten": "then",
		  "htere": "there",
		  "htese": "these",
		  "htey": "they",
		  "htikn": "think",
		  "hting": "thing",
		  "htink": "think",
		  "htis": "this",
		  "humer": "humor",
		  "hvae": "have",
		  "hvaing": "having",
		  "hvea": "have",
		  "hwich": "which",
		  "hwihc": "which",
		  "hwile": "while",
		  "hwole": "whole",
		  "hypocracy": "hypocrisy",
		  "hypocrasy": "hypocrisy",
		  "hypocrit": "hypocrite",
		  "idae": "idea",
		  "idaes": "ideas",
		  "identofy": "identify",
		  "idesa": "ideas",
		  "ie": "i.e.",
		  "ihs": "his",
		  "ik": "i",
		  "ikt": "it",
		  "ilogical": "illogical",
		  "imagenary": "imaginary",
		  "imagin": "imagine",
		  "imediate": "immediate",
		  "imediately": "immediately",
		  "imediatly": "immediately",
		  "imense": "immense",
		  "immediatly": "immediately",
		  "immitate": "imitate",
		  "importent": "important",
		  "importnat": "important",
		  "impossable": "impossible",
		  "improvemnt": "improvement",
		  "improvment": "improvement",
		  "incidently": "incidentally",
		  "includ": "include",
		  "incredable": "incredible",
		  "indecate": "indicate",
		  "indenpendence": "independence",
		  "indenpendent": "independent",
		  "indepedent": "independent",
		  "independance": "independence",
		  "independant": "independent",
		  "indispensible": "indispensable",
		  "inevatible": "inevitable",
		  "inevitible": "inevitable",
		  "infinit": "infinite",
		  "influance": "influence",
		  "infomation": "information",
		  "informatoin": "information",
		  "inital": "initial",
		  "inocence": "innocence",
		  "inot": "into",
		  "insted": "instead",
		  "insurence": "insurance",
		  "inteh": "in the",
		  "intelectual": "intellectual",
		  "inteligence": "intelligence",
		  "inteligent": "intelligent",
		  "interpet": "interpret",
		  "interum": "interim",
		  "interupt": "interrupt",
		  "inthe": "in the",
		  "intrest": "interest",
		  "inwhich": "in which",
		  "irelevent": "irrelevant",
		  "iresistable": "irresistible",
		  "iresistible": "irresistible",
		  "iritable": "irritable",
		  "iritated": "irritated",
		  "irresistable": "irresistible",
		  "itis": "it is",
		  "ititial": "initial",
		  "itnerest": "interest",
		  "itnerested": "interested",
		  "itneresting": "interesting",
		  "itnerests": "interests",
		  "itwas": "it was",
		  "ity": "it",
		  "iwll": "will",
		  "iwth": "with",
		  "january": "January",
		  "jeapardy": "jeopardy",
		  "jstu": "just",
		  "jsut": "just",
		  "jugment": "judgment",
		  "july": "July",
		  "june": "June",
		  "knowldge": "knowledge",
		  "knowlege": "knowledge",
		  "knwo": "know",
		  "knwon": "known",
		  "knwos": "knows",
		  "konw": "know",
		  "konwn": "known",
		  "konws": "knows",
		  "kwno": "know",
		  "labatory": "laboratory",
		  "labratory": "laboratory",
		  "lastyear": "last year",
		  "leanr": "learn",
		  "learnign": "learning",
		  "legitamate": "legitimate",
		  "lenght": "length",
		  "leran": "learn",
		  "lerans": "learns",
		  "levle": "level",
		  "libary": "library",
		  "lible": "liable",
		  "librery": "library",
		  "lief": "life",
		  "lieing": "lying",
		  "liek": "like",
		  "liekd": "liked",
		  "liesure": "leisure",
		  "lieutenent": "lieutenant",
		  "liev": "live",
		  "likly": "likely",
		  "lisense": "license",
		  "litature": "literature",
		  "literture": "literature",
		  "littel": "little",
		  "litttle": "little",
		  "liuke": "like",
		  "liveing": "living",
		  "livley": "lively",
		  "loev": "love",
		  "lonelyness": "loneliness",
		  "lonley": "lonely",
		  "lonly": "lonely",
		  "lookign": "looking",
		  "lsat": "last",
		  "lveo": "love",
		  "lvoe": "love",
		  "maintainance": "maintenance",
		  "maintainence": "maintenance",
		  "maintenence": "maintenance",
		  "makeing": "making",
		  "makse": "makes",
		  "managment": "management",
		  "mantain": "maintain",
		  "manuever": "maneuver",
		  "mariage": "marriage",
		  "marrage": "marriage",
		  "marraige": "marriage",
		  "mathamatics": "mathematics",
		  "mear": "mere",
		  "medacine": "medicine",
		  "memeber": "member",
		  "mena": "mean",
		  "menas": "means",
		  "merchent": "merchant",
		  "mesage": "message",
		  "mesages": "messages",
		  "messanger": "messenger",
		  "minature": "miniature",
		  "mischeivous": "mischievous",
		  "misile": "missile",
		  "mispell": "misspell",
		  "mispelling": "misspelling",
		  "mispellings": "misspellings",
		  "mkae": "make",
		  "mkaes": "makes",
		  "mkaing": "making",
		  "mkea": "make",
		  "moent": "moment",
		  "moeny": "money",
		  "moer": "more",
		  "monday": "Monday",
		  "morgage": "mortgage",
		  "movei": "movie",
		  "mroe": "more",
		  "muscels": "muscles",
		  "mysefl": "myself",
		  "mysterous": "mysterious",
		  "myu": "my",
		  "nad": "and",
		  "naturaly": "naturally",
		  "naturely": "naturally",
		  "necassarily": "necessarily",
		  "necassary": "necessary",
		  "neccessarily": "necessarily",
		  "neccessary": "necessary",
		  "necesarily": "necessarily",
		  "necesary": "necessary",
		  "negotiaing": "negotiating",
		  "neice": "niece",
		  "ni": "in",
		  "nineth": "ninth",
		  "ninty": "ninety",
		  "nkow": "know",
		  "nkwo": "know",
		  "nothign": "nothing",
		  "noticable": "noticeable",
		  "noticeing": "noticing",
		  "november": "November",
		  "nto": "not",
		  "nuculear": "nuclear",
		  "nuisanse": "nuisance",
		  "nusance": "nuisance",
		  "nver": "never",
		  "nwe": "new",
		  "nwo": "now",
		  "oaky": "okay",
		  "obediant": "obedient",
		  "obstacal": "obstacle",
		  "ocasion": "occasion",
		  "ocasionally": "occasionally",
		  "occassion": "occasion",
		  "occassionally": "occasionally",
		  "occurance": "occurrence",
		  "occured": "occurred",
		  "occurence": "occurrence",
		  "occurr": "occur",
		  "occurrance": "occurrence",
		  "october": "October",
		  "ocur": "occur",
		  "ocurr": "occur",
		  "ocurrance": "occurrence",
		  "ocurred": "occurred",
		  "ocurrence": "occurrence",
		  "od": "do",
		  "oen": "one",
		  "oeprator": "operator",
		  "ofits": "of its",
		  "ofthe": "of the",
		  "oging": "going",
		  "ohter": "other",
		  "oif": "of",
		  "omision": "omission",
		  "omited": "omitted",
		  "omre": "more",
		  "oneof": "one of",
		  "onot": "onto",
		  "onthe": "on the",
		  "onyl": "only",
		  "oponent": "opponent",
		  "oportunity": "opportunity",
		  "oposite": "opposite",
		  "oppasite": "opposite",
		  "opperation": "operation",
		  "oppertunity": "opportunity",
		  "oppinion": "opinion",
		  "opposate": "opposite",
		  "opposit": "opposite",
		  "oppotunities": "opportunities",
		  "oppotunity": "opportunity",
		  "optomism": "optimism",
		  "orgin": "origin",
		  "orginal": "original",
		  "orginization": "organization",
		  "orginize": "organize",
		  "orginized": "organized",
		  "ot": "to",
		  "otehr": "other",
		  "otu": "out",
		  "outof": "out of",
		  "overthe": "over the",
		  "owrk": "work",
		  "owudl": "would",
		  "paide": "paid",
		  "palce": "place",
		  "pamplet": "pamphlet",
		  "papaer": "paper",
		  "paralel": "parallel",
		  "parrallel": "parallel",
		  "partof": "part of",
		  "pasttime": "pastime",
		  "payed": "paid",
		  "paymetn": "payment",
		  "paymetns": "payments",
		  "pciture": "picture",
		  "peculure": "peculiar",
		  "peice": "piece",
		  "peices": "pieces",
		  "peolpe": "people",
		  "peom": "poem",
		  "peoms": "poems",
		  "peopel": "people",
		  "peotry": "poetry",
		  "percentof": "percent of",
		  "percentto": "percent to",
		  "performence": "performance",
		  "perhasp": "perhaps",
		  "perhpas": "perhaps",
		  "permanant": "permanent",
		  "perminent": "permanent",
		  "permissable": "permissible",
		  "perphas": "perhaps",
		  "personalyl": "personally",
		  "personel": "personal",
		  "planed": "planned",
		  "pleasent": "pleasant",
		  "plesant": "pleasant",
		  "poeple": "people",
		  "poisin": "poison",
		  "porblem": "problem",
		  "porblems": "problems",
		  "porvide": "provide",
		  "posess": "possess",
		  "posession": "possession",
		  "possable": "possible",
		  "possably": "possibly",
		  "possesion": "possession",
		  "postition": "position",
		  "potentialy": "potentially",
		  "practicaly": "practically",
		  "practicly": "practically",
		  "prairy": "prairie",
		  "preceed": "precede",
		  "prefered": "preferred",
		  "pregnent": "pregnant",
		  "prepair": "prepare",
		  "prepartion": "preparation",
		  "presance": "presence",
		  "presense": "presence",
		  "prevelant": "prevalent",
		  "priviledge": "privilege",
		  "probablly": "probably",
		  "probelm": "problem",
		  "probelms": "problems",
		  "proceedure": "procedure",
		  "profesion": "profession",
		  "profesor": "professor",
		  "proffesion": "profession",
		  "proffesor": "professor",
		  "prominant": "prominent",
		  "prophacy": "prophecy",
		  "propoganda": "propaganda",
		  "psoition": "position",
		  "psycology": "psychology",
		  "pu": "up",
		  "publically": "publicly",
		  "pumkin": "pumpkin",
		  "puting": "putting",
		  "pwoer": "power",
		  "qtuie": "quite",
		  "quantaty": "quantity",
		  "quater": "quarter",
		  "quaters": "quarters",
		  "quesion": "question",
		  "quesions": "questions",
		  "questioms": "questions",
		  "questiosn": "questions",
		  "questoin": "question",
		  "quetion": "question",
		  "quetions": "questions",
		  "quizes": "quizzes",
		  "qutie": "quite",
		  "rae": "are",
		  "raelly": "really",
		  "reacll": "recall",
		  "realy": "really",
		  "realyl": "really",
		  "reccomend": "recommend",
		  "reccommend": "recommend",
		  "reciept": "receipt",
		  "recieve": "receive",
		  "recieved": "received",
		  "recieving": "receiving",
		  "recomend": "recommend",
		  "recomendation": "recommendation",
		  "recomendations": "recommendations",
		  "recomended": "recommended",
		  "reconize": "recognize",
		  "recrod": "record",
		  "rediculous": "ridiculous",
		  "refered": "referred",
		  "refering": "referring",
		  "referrence": "reference",
		  "regluar": "regular",
		  "rela": "real",
		  "relaly": "really",
		  "releive": "relieve",
		  "reluctent": "reluctant",
		  "remeber": "remember",
		  "rememberance": "remembrance",
		  "reommend": "recommend",
		  "repatition": "repetition",
		  "representativs": "representatives",
		  "representive": "representative",
		  "representives": "representatives",
		  "represetned": "represented",
		  "represnt": "represent",
		  "reserach": "research",
		  "resollution": "resolution",
		  "resorces": "resources",
		  "respomd": "respond",
		  "respomse": "response",
		  "responce": "response",
		  "responsability": "responsibility",
		  "responsable": "responsible",
		  "responsibile": "responsible",
		  "responsiblity": "responsibility",
		  "restaraunt": "restaurant",
		  "restraunt": "restaurant",
		  "restuarant": "restaurant",
		  "reult": "result",
		  "reveiw": "review",
		  "reveiwing": "reviewing",
		  "rewriet": "rewrite",
		  "roomate": "roommate",
		  "rumers": "rumors",
		  "russina": "russian",
		  "rwite": "write",
		  "rythm": "rhythm",
		  "sa": "as",
		  "sacrafice": "sacrifice",
		  "saftey": "safety",
		  "saidhe": "said he",
		  "saidit": "said it",
		  "saidthat": "said that",
		  "saidthe": "said the",
		  "salery": "salary",
		  "sargant": "sergeant",
		  "sasy": "says",
		  "saturday": "Saturday",
		  "scedule": "schedule",
		  "sceduled": "scheduled",
		  "schedual": "schedule",
		  "scirpt": "script",
		  "scripot": "script",
		  "secratary": "secretary",
		  "secretery": "secretary",
		  "sectino": "section",
		  "seh": "she",
		  "selectoin": "selection",
		  "sentance": "sentence",
		  "separeate": "separate",
		  "seperate": "separate",
		  "september": "September",
		  "severley": "severely",
		  "shcool": "school",
		  "sherif": "sheriff",
		  "shesaid": "she said",
		  "shineing": "shining",
		  "shiped": "shipped",
		  "shoudl": "should",
		  "shoudln": "shouldn",
		  "shouldent": "shouldn't",
		  "shouldnt": "shouldn't",
		  "showinf": "showing",
		  "si": "is",
		  "sieze": "seize",
		  "signifacnt": "significant",
		  "simalar": "similar",
		  "similiar": "similar",
		  "simpley": "simply",
		  "simpyl": "simply",
		  "sincerley": "sincerely",
		  "sincerly": "sincerely",
		  "sinse": "since",
		  "sitll": "still",
		  "smae": "same",
		  "smoe": "some",
		  "snese": "sense",
		  "soem": "some",
		  "sohw": "show",
		  "somethign": "something",
		  "someting": "something",
		  "somewaht": "somewhat",
		  "somthing": "something",
		  "somtimes": "sometimes",
		  "sophmore": "sophomore",
		  "sotry": "story",
		  "soudn": "sound",
		  "soudns": "sounds",
		  "sould": "soul",
		  "soulds": "souls",
		  "speach": "speech",
		  "specificaly": "specifically",
		  "specificalyl": "specifically",
		  "sponser": "sponsor",
		  "statment": "statement",
		  "statments": "statements",
		  "stnad": "stand",
		  "stopry": "story",
		  "storeis": "stories",
		  "storise": "stories",
		  "stoyr": "story",
		  "stpo": "stop",
		  "strat": "start",
		  "stroy": "story",
		  "stubborness": "stubbornness",
		  "studnet": "student",
		  "successfull": "successful",
		  "successfulyl": "successfully",
		  "suceed": "succeed",
		  "sucess": "success",
		  "sucessfull": "successful",
		  "suer": "sure",
		  "sufficiant": "sufficient",
		  "sumary": "summary",
		  "sunday": "Sunday",
		  "superintendant": "superintendent",
		  "supose": "suppose",
		  "suposed": "supposed",
		  "suppossed": "supposed",
		  "supress": "suppress",
		  "suprise": "surprise",
		  "suprised": "surprised",
		  "surley": "surely",
		  "suround": "surround",
		  "suseptible": "susceptible",
		  "swiming": "swimming",
		  "sya": "say",
		  "syas": "says",
		  "ta": "at",
		  "taeks": "takes",
		  "tahn": "than",
		  "taht": "that",
		  "talek": "talk",
		  "talekd": "talked",
		  "talkign": "talking",
		  "tath": "that",
		  "tecnical": "technical",
		  "teh": "the",
		  "tehy": "they",
		  "temperment": "temperament",
		  "temperture": "temperature",
		  "tendancy": "tendency",
		  "tghe": "the",
		  "thansk": "thanks",
		  "thats": "that's",
		  "thatthe": "that the",
		  "themself": "themselves",
		  "themselfs": "themselves",
		  "thenew": "the new",
		  "ther": "there",
		  "theri": "their",
		  "thesame": "the same",
		  "theyll": "they'll",
		  "theyve": "they've",
		  "thgat": "that",
		  "thge": "the",
		  "thier": "their",
		  "thign": "thing",
		  "thigns": "things",
		  "thigsn": "things",
		  "thikn": "think",
		  "thikning": "thinking",
		  "thikns": "thinks",
		  "thiunk": "think",
		  "thna": "than",
		  "thne": "then",
		  "thnig": "thing",
		  "thnigs": "things",
		  "ths": "this",
		  "thsi": "this",
		  "thsoe": "those",
		  "thta": "that",
		  "thursday": "Thursday",
		  "ti": "it",
		  "tiem": "time",
		  "tih": "with",
		  "tihkn": "think",
		  "tihs": "this",
		  "timne": "time",
		  "tiome": "time",
		  "tje": "the",
		  "tjhe": "the",
		  "tkae": "take",
		  "tkaes": "takes",
		  "tkaing": "taking",
		  "tlaking": "taking",
		  "tobbaco": "tobacco",
		  "todya": "today",
		  "togehter": "together",
		  "toi": "to",
		  "tommorrow": "tomorrow",
		  "tomorow": "tomorrow",
		  "tongiht": "tonight",
		  "tonihgt": "tonight",
		  "totaly": "totally",
		  "totalyl": "totally",
		  "tothe": "to the",
		  "towrad": "toward",
		  "tp": "to",
		  "traditionalyl": "traditionally",
		  "trafficed": "trafficked",
		  "trafic": "traffic",
		  "transfered": "transferred",
		  "truely": "truly",
		  "truley": "truly",
		  "tryed": "tried",
		  "tthe": "the",
		  "tuesday": "Tuesday",
		  "turnk": "trunk",
		  "twon": "town",
		  "tyhat": "that",
		  "tyhe": "the",
		  "tyo": "to",
		  "tyr": "try",
		  "tyrany": "tyranny",
		  "udnerstand": "understand",
		  "uin": "in",
		  "unconcious": "unconscious",
		  "understnad": "understand",
		  "unecessary": "unnecessary",
		  "unliek": "unlike",
		  "unmistakeably": "unmistakably",
		  "untill": "until",
		  "untilll": "until",
		  "useage": "usage",
		  "usefull": "useful",
		  "useing": "using",
		  "usualy": "usually",
		  "usualyl": "usually",
		  "vaccum": "vacuum",
		  "valuble": "valuable",
		  "vegtable": "vegetable",
		  "venemous": "venomous",
		  "vengance": "vengeance",
		  "veyr": "very",
		  "vigilence": "vigilance",
		  "villin": "villain",
		  "visable": "visible",
		  "vrey": "very",
		  "vyer": "very",
		  "vyre": "very",
		  "waht": "what",
		  "warrent": "warrant",
		  "wasnt": "wasn't",
		  "watn": "want",
		  "wednesday": "Wednesday",
		  "wehn": "when",
		  "weild": "wield",
		  "wendsay": "Wednesday",
		  "wensday": "Wednesday",
		  "whcih": "which",
		  "whereever": "wherever",
		  "whic": "which",
		  "whihc": "which",
		  "wholy": "wholly",
		  "whta": "what",
		  "wief": "wife",
		  "wierd": "weird",
		  "wihch": "which",
		  "wiht": "with",
		  "willbe": "will be",
		  "wintery": "wintry",
		  "wirting": "writing",
		  "witha": "with a",
		  "withdrawl": "withdrawal",
		  "withe": "with",
		  "withthe": "with the",
		  "wiull": "will",
		  "wnat": "want",
		  "wnated": "wanted",
		  "wnats": "wants",
		  "woh": "who",
		  "wohle": "whole",
		  "wokr": "work",
		  "woudl": "would",
		  "wouldbe": "would be",
		  "wouldnt": "wouldn't",
		  "wriet": "write",
		  "writting": "writing",
		  "wrod": "word",
		  "wroet": "wrote",
		  "wrok": "work",
		  "wroking": "working",
		  "wsa": "was",
		  "wtih": "with",
		  "wuould": "would",
		  "wya": "way",
		  "yeasr": "years",
		  "yeild": "yield",
		  "yera": "year",
		  "yeras": "years",
		  "yersa": "years",
		  "yoiu": "you",
		  "yoor": "your",
		  "youare": "you are",
		  "youve": "you've",
		  "yse": "use",
		  "ytou": "you",
		  "yuo": "you",
		  "yuor": "your"
		}
	  });
})



function setResponseHeader(res) {
	res.setHeader("Access-Control-Allow-Headers", "content-type,tiny-api-key")
	res.setHeader("Access-Control-Allow-Origin", "http://192.168.1.16:8000")
	res.setHeader("Access-Control-Allow-Credentials", true)
	res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
	res.setHeader("Access-Control-Max-Age", 3600)
	res.setHeader("Sec-Fetch-Site", "cross-site")
	res.setHeader("Sec-Fetch-Mode", "cors")
	res.setHeader("Accept", "application/json, text/javascript, */*; q=0.01")
	res.setHeader("tiny-api-key", "4wm3a9m1txa14ot3g6axov5sz0tmpis5ne54qefjip4u0jdf")
	res.setHeader("Content-Type", "application/json")
	return res;
}

async function ondictionary(err, dict) {
	if (err) {
	  throw err
	}

	console.log(currentCode);
	const spell = nspell(dict)
	spells[currentCode] = spell

	initNextDictionary();
	// console.log(spell.correct(text))
	// console.log(spell.correct('colour')) // => false
	// console.log(spell.suggest('welcume')) // => ['color']
	// console.log(spell.correct('color')) // => true
	// console.log(spell.correct('npm')) // => false
	// spell.add('npm')
	// console.log(spell.correct('npm')) // => true
  }

function initNextDictionary() {
	currentCode = nextSupportedCode();
	if (currentCode != ""){
		var nextDictionary = require('dictionary' + '-' + currentCode);
		nextDictionary(ondictionary);
	} else {
		console.log("Finished Initializing dictionaries")
	}
}

function supportedCodes() {
	return dictCodes;
	// return fullSupportedDictCodes;
}

function nextSupportedCode() {
	supportedCodeIndex = supportedCodeIndex + 1;
	if(dictCodes.length == 0) {
		return "";
	} else if(supportedCodeIndex < 0 || supportedCodeIndex + 1 > supportedCodes().length) {
		return "";
	} else {
		return supportedCodes()[supportedCodeIndex];
	}
}

function isRealValue(obj)
{
 return obj && obj !== 'null' && obj !== 'undefined';
}
