{
	"translatorID": "0cdc6a07-38cf-4ec1-b9d5-7a3c0cc89b15",
	"label": "OSTI Energy Citations",
	"creator": "Michael Berkowitz",
	"target": "^https?://www\\.osti\\.gov/energycitations",
	"minVersion": "1.0.0b4.r5",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2012-11-24 11:36:35"
}

/*
    Translator
   Copyright (C) 2012 Sebastian Karcher an Avram Lyon

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU Affero General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Affero General Public License for more details.

   You should have received a copy of the GNU Affero General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function detectWeb(doc,url) {
	var xpathreport='//meta[@name="citation_technical_report_number"]';
	var xpath='//meta[@name="citation_journal_title"]'; 
	if (ZU.xpath(doc, xpath).length > 0) {
		return "journalArticle";
	}
	if (ZU.xpath(doc, xpathreport).length > 0) {
		return "report";
	}
			
	if (url.indexOf("search.jsp")!=-1){
		return "multiple";
	}

	return false;
}


function doWeb(doc,url)
{
	if (detectWeb(doc, url) == "multiple") {
		var hits = {};
		var urls = [];
		var results = ZU.xpath(doc,"//table[@class='searchresults']//a[@class='citation']");
	
		for (var i in results) {
			hits[results[i].href] = results[i].textContent;
		}
		Z.selectItems(hits, function(items) {
			if (items == null) return true;
			for (var j in items) {
				urls.push(j);
			}
			ZU.processDocuments(urls, function (myDoc) { 
				doWeb(myDoc, myDoc.location.href) } );

		});
	} else {
		var pageno = ZU.xpathText(doc, '//table[@class="productDetails"]/tbody/tr/th[contains(text(), "Format")]/following-sibling::td')
		if (pageno && pageno.indexOf("Pages")!=-1) pageno = pageno.match(/Pages:\s*(\d+)/)
		var type = ZU.xpathText(doc, '//table[@class="productDetails"]/tbody/tr/th[contains(text(), "Resource Type")]/following-sibling::td');
		var itemtype;
		//Currently journal articles and reports work through metadata, thesis was an easy call
		//It's be easy to add other item types.
		if (type.indexOf("Thesis")!=-1) itemtype = "thesis";
		
		// We call the Embedded Metadata translator to do the actual work
		var translator = Zotero.loadTranslator("import");
		translator.setTranslator("951c027d-74ac-47d4-a107-9c3069ab7b48");
		translator.setHandler("itemDone", function(obj, item) {
				if (item.institution){
					var place = item.institution.match(/[A-Za-z]+,\s*[A-Z]{2}$/)
					if (place){
						item.place = place[0]
						item.institution = item.institution.replace(/[A-Za-z]+,\s*[A-Z]{2}$/, "")
					}
				}
				if (item.title = item.title.toUpperCase()) {
					item.title = ZU.capitalizeTitle(item.title.toLowerCase(), true)
				}
				if (pageno) item.numPages = pageno[1];
				
				if (itemtype) item.itemType = itemtype;
				item.complete();
				});
				
		translator.getTranslatorObject(function (obj) {
				obj.doWeb(doc, url);
				});
	}
}
/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "http://www.osti.gov/energycitations/product.biblio.jsp?query_id=0&page=0&osti_id=893699",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [
					{
						"firstName": "P.",
						"lastName": "Wang",
						"creatorType": "author"
					},
					{
						"firstName": "A. W.",
						"lastName": "Thomas",
						"creatorType": "author"
					},
					{
						"firstName": "A. G.",
						"lastName": "Williams",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [
					"physics of elementary particles and fields",
					"nuclear matter",
					"quark matter",
					"quarks",
					"superconductivity"
				],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Full Text PDF",
						"mimeType": "application/pdf"
					},
					{
						"title": "Snapshot"
					}
				],
				"title": "Phase Transition from Hadronic Matter to Quark Matter",
				"date": "04/01/2007",
				"publicationTitle": "Phys.Rev.C",
				"volume": "75",
				"institution": "Thomas Jefferson National Accelerator Facility, Newport",
				"number": "JLAB-THY-06-545; DOE/ER/40150-4072",
				"DOI": "10.1103/PhysRevC.75.045202",
				"language": "English",
				"url": "http://www.osti.gov/energycitations/product.biblio.jsp?query_id=0&page=0&osti_id=893699",
				"accessDate": "CURRENT_TIMESTAMP",
				"libraryCatalog": "www.osti.gov",
				"place": "News, VA",
				"numPages": "S"
			}
		]
	},
	{
		"type": "web",
		"url": "http://www.osti.gov/energycitations/product.biblio.jsp?query_id=0&page=0&osti_id=900531",
		"items": [
			{
				"itemType": "report",
				"creators": [
					{
						"firstName": "Joseph",
						"lastName": "Gambogi",
						"creatorType": "author"
					},
					{
						"firstName": "Stephen J.",
						"lastName": "Gerdemann",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [
					"materials science",
					"chlorination",
					"corrosion resistance",
					"economics",
					"machining",
					"magnesium",
					"mining",
					"physical properties",
					"production",
					"purification",
					"rutile",
					"titanium",
					"titanium",
					"titanium metal",
					"kroll process"
				],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Full Text PDF",
						"mimeType": "application/pdf"
					},
					{
						"title": "Snapshot"
					}
				],
				"title": "Titanium Metal: Extraction to Application",
				"date": "09/01/2002",
				"institution": "Albany Research Center (ARC),",
				"number": "DOE/ARC-1999-060",
				"publisher": "TMS (The Minerals, Metals & Materials Society), Warrendale, PA",
				"language": "English",
				"url": "http://www.osti.gov/energycitations/product.biblio.jsp?query_id=0&page=0&osti_id=900531",
				"accessDate": "CURRENT_TIMESTAMP",
				"libraryCatalog": "www.osti.gov",
				"place": "Albany, OR",
				"shortTitle": "Titanium Metal"
			}
		]
	}
]
/** END TEST CASES **/