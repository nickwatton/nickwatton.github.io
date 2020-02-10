<?php

require './common.php';
require './vendor/CensorWords.php';

init_call();

// If the database hasn't been setup then do so now
function create_structure() {
	run_query('
		CREATE TABLE IF NOT EXISTS scores (
			id 				INT(11)      NOT NULL AUTO_INCREMENT,
			score			INT(11)      DEFAULT 0,
			attempts		INT(11)      DEFAULT 0,
			first_name		VARCHAR(255) DEFAULT NULL,
			last_name		VARCHAR(255) DEFAULT NULL,
			email			VARCHAR(255) DEFAULT NULL,
			address_1		VARCHAR(255) DEFAULT NULL,
			address_2		VARCHAR(255) DEFAULT NULL,
			address_3		VARCHAR(255) DEFAULT NULL,
			postcode		VARCHAR(255) DEFAULT NULL,
			organisation	VARCHAR(255) DEFAULT NULL,
			created			DATETIME     DEFAULT NULL,
			updated			DATETIME     DEFAULT NULL,
			ip_address		VARCHAR(255) DEFAULT NULL,
			profanity		BOOLEAN DEFAULT NULL,
			PRIMARY KEY (id)
		);
	');

	// create_dummy_content();
}

function create_dummy_content() {
	if (!exists_query('SELECT * FROM scores')) {
		create_score(173, "Deborah", "Mason", "dmason0@soup.io", "538 Blue Bill Park Parkway", "", "", "", "public", true);
		create_score(416, "Keith", "Graham", "kgraham1@meetup.com", "9 Mendota Pass", "", "", "", "standard_life", true);
		create_score(102, "Christine", "Reed", "creed2@engadget.com", "51 Debs Parkway", "", "", "", "ireland_ifa", true);
		create_score(12, "Jesse", "Clark", "jclark3@mit.edu", "8044 Doe Crossing Hill", "", "", "", "public", true);
		create_score(681, "Irene", "Jones", "ijones4@printfriendly.com", "6530 Judy Terrace", "", "", "", "standard_life", true);
		create_score(418, "Dean", "Henderson", "shenderson5@un.org", "7174 Annamark Court", "", "", "", "ireland_ifa", true);
		create_score(915, "Judith", "Bell", "jbell6@t-online.de", "3 Judy Drive", "", "", "", "public", true);
		create_score(747, "Norma", "Rodriguez", "nrodriguez7@nifty.com", "72188 International Street", "", "", "", "standard_life", true);
		create_score(456, "Anna", "Flores", "aflores8@wired.com", "86 Jackson Parkway", "", "", "", "ireland_ifa", true);
		create_score(160, "Marilyn", "Harris", "mharris9@blogger.com", "1 Hanson Avenue", "", "", "", "public", true);
		create_score(699, "Douglas", "Webb", "dwebba@chron.com", "7432 Fordem Junction", "", "", "", "standard_life", true);
		create_score(639, "Jason", "Kelly", "jkellyb@vk.com", "1780 Hanson Place", "", "", "", "ireland_ifa", true);
		create_score(239, "Rose", "James", "rjamesc@nyu.edu", "3081 David Place", "", "", "", "public", true);
		create_score(932, "Joyce", "Hart", "jhartd@dagondesign.com", "03 Fuller Junction", "", "", "", "standard_life", true);
		create_score(228, "Douglas", "Pierce", "dpiercee@tumblr.com", "92799 Upham Plaza", "", "", "", "ireland_ifa", true);
		create_score(909, "Joseph", "Webb", "jwebbf@stumbleupon.com", "4 Sachs Crossing", "", "", "", "public", true);
		create_score(983, "Ernest", "Garcia", "egarciag@umich.edu", "01 Wayridge Pass", "", "", "", "standard_life", true);
		create_score(253, "Helen", "Johnston", "hjohnstonh@cnn.com", "361 Fairview Hill", "", "", "", "ireland_ifa", true);
		create_score(166, "James", "Knight", "jknighti@xing.com", "7622 Lake View Park", "", "", "", "public", true);
		create_score(314, "Karen", "Hunter", "khunterj@furl.net", "81246 Kenwood Road", "", "", "", "standard_life", true);
		create_score(948, "Jean", "Ruiz", "jruizk@mozilla.com", "0105 Vera Parkway", "", "", "", "ireland_ifa", true);
		create_score(859, "Willie", "Morales", "wmoralesl@blogs.com", "35 Reindahl Way", "", "", "", "public", true);
		create_score(553, "Judy", "Robertson", "jrobertsonm@icq.com", "23 4th Road", "", "", "", "standard_life", true);
		create_score(628, "Jacqueline", "Montgomery", "jmontgomeryn@ftc.gov", "2 Welch Point", "", "", "", "ireland_ifa", true);
		create_score(221, "Gregory", "Hunter", "ghuntero@yellowpages.com", "9 Mallard Park", "", "", "", "public", true);
		create_score(299, "Patrick", "Wright", "pwrightp@rambler.ru", "83 Del Mar Point", "", "", "", "standard_life", true);
		create_score(430, "Catherine", "Nguyen", "cnguyenq@pen.io", "81 Oak Valley Alley", "", "", "", "ireland_ifa", true);
		create_score(714, "Ruth", "King", "rkingr@utexas.edu", "250 Algoma Junction", "", "", "", "public", true);
		create_score(590, "Chris", "Fields", "cfieldss@paypal.com", "5 Jackson Plaza", "", "", "", "standard_life", true);
		create_score(836, "Doris", "Barnes", "dbarnest@foxnews.com", "3465 Michigan Hill", "", "", "", "ireland_ifa", true);
		create_score(5, "Amanda", "Nichols", "anicholsu@elegantthemes.com", "83830 Manufacturers Road", "", "", "", "public", true);
		create_score(93, "Nicholas", "Matthews", "nmatthewsv@microsoft.com", "8 Pond Lane", "", "", "", "standard_life", true);
		create_score(650, "Paul", "Woods", "pwoodsw@reference.com", "692 Summerview Avenue", "", "", "", "ireland_ifa", true);
		create_score(49, "Marilyn", "Andrews", "mandrewsx@so-netne.jp", "512 Mccormick Lane", "", "", "", "public", true);
		create_score(782, "Maria", "Martinez", "mmartinezy@timesonline.co.uk", "4634 Carberry Way", "", "", "", "standard_life", true);
		create_score(628, "Juan", "Dean", "jdeanz@guardian.co.uk", "0379 Prairieview Center", "", "", "", "ireland_ifa", true);
		create_score(43, "Linda", "King", "lking10@mozilla.com", "41 Tennyson Crossing", "", "", "", "public", true);
		create_score(717, "Joseph", "Gray", "jgray11@timesonline.co.uk", "176 Buell Avenue", "", "", "", "standard_life", true);
		create_score(563, "Andrea", "Price", "aprice12@newyorker.com", "49 Meadow Valley Park", "", "", "", "ireland_ifa", true);
		create_score(120, "Kimberly", "Schmidt", "kschmidt13@intel.com", "859 Dahle Court", "", "", "", "public", true);
		create_score(849, "Louise", "Perez", "lperez14@uiuc.edu", "6 Truax Parkway", "", "", "", "standard_life", true);
		create_score(953, "James", "Robertson", "jrobertson15@plala.or.jp", "40921 Bobwhite Terrace", "", "", "", "ireland_ifa", true);
		create_score(977, "Gerald", "Johnson", "gjohnson16@businessweek.com", "86 Sullivan Avenue", "", "", "", "public", true);
		create_score(605, "Patricia", "Duncan", "pduncan17@webeden.co.uk", "28813 Crowley Place", "", "", "", "standard_life", true);
		create_score(179, "Larry", "Howell", "lhowell18@printfriendly.com", "771 Valley Edge Place", "", "", "", "ireland_ifa", true);
		create_score(22, "Martha", "Morrison", "mmorrison19@jugem.jp", "156 Emmet Lane", "", "", "", "public", true);
		create_score(413, "Billy", "Howard", "bhoward1a@altervista.org", "59075 Esch Terrace", "", "", "", "standard_life", true);
		create_score(743, "Mary", "Chavez", "mchavez1b@chron.com", "49 Waywood Hill", "", "", "", "ireland_ifa", true);
		create_score(936, "Frances", "Hicks", "fhicks1c@webeden.co.uk", "926 Eliot Lane", "", "", "", "public", true);
		create_score(240, "Brenda", "Wells", "bwells1d@ebay.co.uk", "5661 Eastlawn Drive", "", "", "", "standard_life", true);
		create_score(781, "Anthony", "Peters", "apeters1e@last.fm", "15014 Shasta Place", "", "", "", "ireland_ifa", true);
		create_score(831, "Brandon", "Black", "bblack1f@altervista.org", "34 Dexter Lane", "", "", "", "public", true);
		create_score(992, "Harold", "Miller", "hmiller1g@xrea.com", "480 Norway Maple Terrace", "", "", "", "standard_life", true);
		create_score(415, "Adam", "Carter", "acarter1h@chronoengine.com", "0 Kensington Way", "", "", "", "ireland_ifa", true);
		create_score(955, "Diane", "Carroll", "dcarroll1i@ucsd.edu", "569 Packers Crossing", "", "", "", "public", true);
		create_score(132, "Lois", "Lawson", "llawson1j@1688.com", "418 Rockefeller Circle", "", "", "", "standard_life", true);
		create_score(352, "Donald", "Gardner", "dgardner1k@clickbank.net", "60432 Texas Point", "", "", "", "ireland_ifa", true);
		create_score(938, "Arthur", "Willis", "awillis1l@nba.com", "0001 Bashford Way", "", "", "", "public", true);
		create_score(490, "Fred", "Coleman", "fcoleman1m@youtu.be", "43 Katie Road", "", "", "", "standard_life", true);
		create_score(977, "Tina", "Perry", "tperry1n@patch.com", "39663 Tennessee Hill", "", "", "", "ireland_ifa", true);
		create_score(275, "Louis", "Cruz", "lcruz1o@issuu.com", "2 2nd Pass", "", "", "", "public", true);
		create_score(851, "Martha", "Burton", "mburton1p@ebay.co.uk", "818 Butternut Street", "", "", "", "standard_life", true);
		create_score(580, "Cheryl", "Morales", "cmorales1q@last.fm", "5 Reindahl Point", "", "", "", "ireland_ifa", true);
		create_score(498, "Jennifer", "West", "jwest1r@myspace.com", "1334 Dahle Circle", "", "", "", "public", true);
		create_score(973, "Jeremy", "Jones", "jjones1s@devhub.com", "291 Oxford Circle", "", "", "", "standard_life", true);
		create_score(666, "Johnny", "Ray", "jray1t@geocities.jp", "34930 Oxford Pass", "", "", "", "ireland_ifa", true);
		create_score(818, "Sara", "Ruiz", "sruiz1u@newsvine.com", "2 Shoshone Trail", "", "", "", "public", true);
		create_score(231, "Stephanie", "Gordon", "sgordon1v@house.gov", "57559 American Ash Point", "", "", "", "standard_life", true);
		create_score(356, "Stephen", "Peterson", "speterson1w@prlog.org", "8 South Alley", "", "", "", "ireland_ifa", true);
		create_score(686, "Virginia", "Howell", "vhowell1x@godaddy.com", "22420 Independence Parkway", "", "", "", "public", true);
		create_score(959, "Christopher", "Robertson", "crobertson1y@fema.gov", "246 Fulton Terrace", "", "", "", "standard_life", true);
		create_score(156, "Jeremy", "Gilbert", "jgilbert1z@java.com", "43611 Bartelt Junction", "", "", "", "ireland_ifa", true);
		create_score(922, "Howard", "Hudson", "hhudson20@irs.gov", "2 Summit Crossing", "", "", "", "public", true);
		create_score(221, "Randy", "Ortiz", "rortiz21@aboutads.info", "77 Homewood Terrace", "", "", "", "standard_life", true);
		create_score(734, "Sharon", "James", "sjames22@ibm.com", "92576 Heath Pass", "", "", "", "ireland_ifa", true);
		create_score(500, "Rachel", "Bishop", "rbishop23@youtube.com", "8 Calypso Street", "", "", "", "public", true);
		create_score(359, "Randy", "Howard", "rhoward24@desdev.cn", "502 Lakewood Gardens Pass", "", "", "", "standard_life", true);
		create_score(12, "Nicole", "Marshall", "nmarshall25@rakuten.co.jp", "8 Dwight Road", "", "", "", "ireland_ifa", true);
		create_score(847, "Ruth", "Allen", "rallen26@salon.com", "29 Mitchell Hill", "", "", "", "public", true);
		create_score(520, "Bobby", "Lopez", "blopez27@aol.com", "183 Hagan Hill", "", "", "", "standard_life", true);
		create_score(51, "Elizabeth", "Kennedy", "ekennedy28@businesswire.com", "5099 Banding Trail", "", "", "", "ireland_ifa", true);
		create_score(856, "Marilyn", "Baker", "mbaker29@netvibes.com", "69 Pond Junction", "", "", "", "public", true);
		create_score(717, "Keith", "Adams", "kadams2a@godaddy.com", "017 Calypso Place", "", "", "", "standard_life", true);
		create_score(7, "Marie", "Weaver", "mweaver2b@printfriendly.com", "3 La Follette Way", "", "", "", "ireland_ifa", true);
		create_score(556, "Tina", "Austin", "taustin2c@salon.com", "75661 Carpenter Junction", "", "", "", "public", true);
		create_score(405, "Joshua", "Howell", "jhowell2d@dailymail.co.uk", "7041 Schiller Trail", "", "", "", "standard_life", true);
		create_score(484, "Jacqueline", "Stephens", "jstephens2e@boston.com", "1 Spohn Pass", "", "", "", "ireland_ifa", true);
		create_score(35, "Steven", "Walker", "swalker2f@altervista.org", "00956 Esker Pass", "", "", "", "public", true);
		create_score(72, "Sara", "Willis", "swillis2g@reddit.com", "330 Reinke Terrace", "", "", "", "standard_life", true);
		create_score(320, "Douglas", "Holmes", "dholmes2h@a8.net", "435 Sutteridge Pass", "", "", "", "ireland_ifa", true);
		create_score(44, "Dorothy", "Sanders", "dsanders2i@ezinearticles.com", "6576 Becker Center", "", "", "", "public", true);
		create_score(604, "Russell", "Snyder", "rsnyder2j@friendfeed.com", "375 Eastlawn Point", "", "", "", "standard_life", true);
		create_score(419, "Kathryn", "Fernandez", "kfernandez2k@shop-pro.jp", "17679 Nelson Hill", "", "", "", "ireland_ifa", true);
		create_score(794, "Thomas", "Harper", "tharper2l@dailymotion.com", "2 Dorton Terrace", "", "", "", "public", true);
		create_score(3, "Stephanie", "Boyd", "sboyd2m@gravatar.com", "58 1st Crossing", "", "", "", "standard_life", true);
		create_score(406, "Jesse", "Hanson", "jhanson2n@51.la", "23 Fieldstone Alley", "", "", "", "ireland_ifa", true);
		create_score(535, "Ashley", "Matthews", "amatthews2o@samsung.com", "65247 Calypso Terrace", "", "", "", "public", true);
		create_score(129, "Kelly", "Castillo", "kcastillo2p@nyu.edu", "68922 Kensington Park", "", "", "", "standard_life", true);
		create_score(203, "Rachel", "Green", "rgreen2q@archive.org", "844 Talmadge Point", "", "", "", "ireland_ifa", true);
		create_score(505, "Annie", "Montgomery", "amontgomery2r@w3.org", "1270 Meadow Vale Junction", "", "", "", "public", true);
		create_score(943, "Terry", "Garrett", "tgarrett2s@chicagotribune.com", "4914 Lawn Way", "", "", "", "standard_life", true);
		create_score(81, "Robin", "Williamson", "rwilliamson2t@istockphoto.com", "02 Prairie Rose Place", "", "", "", "ireland_ifa", true);
		create_score(737, "Eugene", "Mendoza", "emendoza2u@dedecms.com", "693 Red Cloud Terrace", "", "", "", "public", true);
		create_score(490, "Jeffrey", "Burns", "jburns2v@apache.org", "7 Norway Maple Park", "", "", "", "standard_life", true);
		create_score(143, "Jesse", "Hamilton", "jhamilton2w@home.pl", "4 Fair Oaks Court", "", "", "", "ireland_ifa", true);
		create_score(231, "Fred", "Edwards", "fedwards2x@addthis.com", "77096 Pankratz Hill", "", "", "", "public", true);
		create_score(694, "Victor", "Cruz", "vcruz2y@de.vu", "09162 Butterfield Terrace", "", "", "", "standard_life", true);
		create_score(183, "Kelly", "Hayes", "khayes2z@aboutads.info", "69 Jenifer Pass", "", "", "", "ireland_ifa", true);
		create_score(737, "Kenneth", "Jones", "kjones30@elegantthemes.com", "32 Autumn Leaf Lane", "", "", "", "public", true);
		create_score(94, "Edward", "Cooper", "ecooper31@amazon.co.uk", "885 Helena Park", "", "", "", "standard_life", true);
		create_score(823, "Ann", "Bailey", "abailey32@ftc.gov", "9439 Esch Crossing", "", "", "", "ireland_ifa", true);
		create_score(929, "Phillip", "Wells", "pwells33@ovh.net", "195 Karstens Lane", "", "", "", "public", true);
		create_score(280, "Jacqueline", "Mcdonald", "jmcdonald34@va.gov", "70 Kinsman Alley", "", "", "", "standard_life", true);
		create_score(778, "Ruby", "Jones", "rjones35@psu.edu", "66 Vera Park", "", "", "", "ireland_ifa", true);
		create_score(681, "Karen", "Hart", "khart36@infoseek.co.jp", "6 Northview Junction", "", "", "", "public", true);
		create_score(45, "Virginia", "Garrett", "vgarrett37@usatoday.com", "626 Sunbrook Court", "", "", "", "standard_life", true);
		create_score(341, "Justin", "Dixon", "jdixon38@blogs.com", "1 Blue Bill Park Alley", "", "", "", "ireland_ifa", true);
		create_score(549, "Carl", "Holmes", "cholmes39@wikia.com", "2 Sutteridge Court", "", "", "", "public", true);
		create_score(526, "Jason", "Burns", "jburns3a@who.int", "83 Menomonie Alley", "", "", "", "standard_life", true);
		create_score(628, "Ryan", "Oliver", "roliver3b@ucsd.edu", "24789 Rutledge Hill", "", "", "", "ireland_ifa", true);
		create_score(995, "Fred", "Stone", "fstone3c@hugedomains.com", "479 Carey Lane", "", "", "", "public", true);
		create_score(183, "Betty", "Palmer", "bpalmer3d@nydailynews.com", "9 Cottonwood Trail", "", "", "", "standard_life", true);
		create_score(22, "Helen", "Burton", "hburton3e@dailymail.co.uk", "61 Spohn Point", "", "", "", "ireland_ifa", true);
		create_score(160, "Lillian", "Armstrong", "larmstrong3f@fc2.com", "08696 Cherokee Hill", "", "", "", "public", true);
		create_score(853, "Johnny", "Kelly", "jkelly3g@goo.ne.jp", "94 Gateway Place", "", "", "", "standard_life", true);
		create_score(844, "Christina", "Myers", "cmyers3h@github.io", "771 Center Way", "", "", "", "ireland_ifa", true);
		create_score(255, "Evelyn", "Wallace", "ewallace3i@flavors.me", "48119 Arapahoe Plaza", "", "", "", "public", true);
		create_score(120, "Bonnie", "Rogers", "brogers3j@plala.or.jp", "0145 Novick Junction", "", "", "", "standard_life", true);
		create_score(563, "Eric", "Johnston", "ejohnston3k@wp.com", "02237 Golf Road", "", "", "", "ireland_ifa", true);
		create_score(394, "Jean", "Bell", "jbell3l@yale.edu", "57 Dovetail Trail", "", "", "", "public", true);
		create_score(934, "Joyce", "Miller", "jmiller3m@nature.com", "91585 Dapin Trail", "", "", "", "standard_life", true);
		create_score(81, "Kathleen", "Day", "kday3n@nyu.edu", "0 Lighthouse Bay Trail", "", "", "", "ireland_ifa", true);
		create_score(134, "Billy", "Harvey", "bharvey3o@360.cn", "682 Vahlen Plaza", "", "", "", "public", true);
		create_score(532, "Brandon", "Simpson", "bsimpson3p@yelp.com", "79393 Grayhawk Terrace", "", "", "", "standard_life", true);
		create_score(686, "Gloria", "Martinez", "gmartinez3q@wikimedia.org", "69015 Schiller Avenue", "", "", "", "ireland_ifa", true);
		create_score(868, "Anthony", "Garrett", "agarrett3r@woothemes.com", "75 Vahlen Hill", "", "", "", "public", true);
		create_score(492, "Mark", "Mendoza", "mmendoza3s@bloglines.com", "66164 Sunfield Street", "", "", "", "standard_life", true);
		create_score(130, "Steve", "Harvey", "sharvey3t@dell.com", "365 Mockingbird Lane", "", "", "", "ireland_ifa", true);
		create_score(934, "Wayne", "Peterson", "wpeterson3u@washingtonpost.com", "0243 Fieldstone Trail", "", "", "", "public", true);
		create_score(507, "Ryan", "Parker", "rparker3v@seattletimes.com", "7876 Atwood Circle", "", "", "", "standard_life", true);
		create_score(715, "James", "Austin", "jaustin3w@examiner.com", "74367 Talmadge Drive", "", "", "", "ireland_ifa", true);
		create_score(756, "Randy", "Miller", "rmiller3x@dailymotion.com", "63 Luster Park", "", "", "", "public", true);
		create_score(523, "Brenda", "Dixon", "bdixon3y@house.gov", "36476 Butternut Alley", "", "", "", "standard_life", true);
		create_score(881, "Joan", "Brown", "jbrown3z@soup.io", "21783 Luster Crossing", "", "", "", "ireland_ifa", true);
		create_score(794, "Jane", "Medina", "jmedina40@addtoany.com", "28 Meadow Valley Point", "", "", "", "public", true);
		create_score(914, "Ronald", "Hernandez", "rhernandez41@indiegogo.com", "78260 Clove Junction", "", "", "", "standard_life", true);
		create_score(188, "Ralph", "Myers", "rmyers42@businesswire.com", "5712 Forest Center", "", "", "", "ireland_ifa", true);
		create_score(380, "Anna", "Ward", "award43@twitpic.com", "52 Hanover Lane", "", "", "", "public", true);
		create_score(476, "Amy", "Henderson", "ahenderson44@marriott.com", "774 Kingsford Center", "", "", "", "standard_life", true);
		create_score(731, "Martha", "Henderson", "mhenderson45@360.cn", "20 Lindbergh Terrace", "", "", "", "ireland_ifa", true);
		create_score(218, "Joseph", "Rogers", "jrogers46@studiopress.com", "1 Talisman Circle", "", "", "", "public", true);
		create_score(111, "Peter", "Hawkins", "phawkins47@techcrunch.com", "58 Gerald Place", "", "", "", "standard_life", true);
		create_score(82, "Joyce", "Davis", "jdavis48@apache.org", "95399 Kennedy Terrace", "", "", "", "ireland_ifa", true);
		create_score(408, "Jimmy", "Dean", "jdean49@google.com.hk", "7 La Follette Place", "", "", "", "public", true);
		create_score(54, "Charles", "Bryant", "cbryant4a@behance.net", "56 Jay Place", "", "", "", "standard_life", true);
		create_score(687, "Melissa", "Myers", "mmyers4b@eepurl.com", "10855 Hoard Hill", "", "", "", "ireland_ifa", true);
		create_score(706, "Arthur", "Phillips", "aphillips4c@joomla.org", "22 Grasskamp Circle", "", "", "", "public", true);
		create_score(710, "David", "Armstrong", "darmstrong4d@seattletimes.com", "3063 Pankratz Trail", "", "", "", "standard_life", true);
		create_score(51, "Bruce", "Taylor", "btaylor4e@canalblog.com", "00 Gale Parkway", "", "", "", "ireland_ifa", true);
		create_score(872, "Diana", "Coleman", "dcoleman4f@ox.ac.uk", "38 Northfield Hill", "", "", "", "public", true);
		create_score(231, "Matthew", "Reyes", "mreyes4g@ifeng.com", "6895 Nevada Point", "", "", "", "standard_life", true);
		create_score(706, "Brandon", "Hudson", "bhudson4h@miibeian.gov.cn", "4676 Anhalt Crossing", "", "", "", "ireland_ifa", true);
		create_score(481, "Jesse", "Romero", "jromero4i@icio.us", "2 Randy Center", "", "", "", "public", true);
		create_score(425, "Jimmy", "Ellis", "jellis4j@businesswire.com", "27 Lakewood Gardens Pass", "", "", "", "standard_life", true);
		create_score(430, "Julie", "Simmons", "jsimmons4k@nbcnews.com", "905 Schlimgen Street", "", "", "", "ireland_ifa", true);
		create_score(381, "Walter", "Long", "wlong4l@oakley.com", "07 Melody Plaza", "", "", "", "public", true);
		create_score(802, "Beverly", "Bailey", "bbailey4m@mayoclinic.com", "71 Redwing Court", "", "", "", "standard_life", true);
		create_score(199, "Catherine", "Johnston", "cjohnston4n@istockphoto.com", "7 Vermont Street", "", "", "", "ireland_ifa", true);
		create_score(140, "Craig", "Harrison", "charrison4o@google.de", "14948 Trailsway Circle", "", "", "", "public", true);
		create_score(597, "Steven", "Reed", "sreed4p@examiner.com", "94 Magdeline Center", "", "", "", "standard_life", true);
		create_score(188, "Patrick", "Hunter", "phunter4q@indiatimes.com", "4112 Lakewood Gardens Alley", "", "", "", "ireland_ifa", true);
		create_score(873, "Beverly", "Mccoy", "bmccoy4r@blogspot.com", "6 Scott Point", "", "", "", "public", true);
		create_score(597, "Jennifer", "Mason", "jmason4s@1688.com", "1631 Walton Place", "", "", "", "standard_life", true);
		create_score(663, "Donna", "Barnes", "dbarnes4t@tinyurl.com", "928 Larry Avenue", "", "", "", "ireland_ifa", true);
		create_score(468, "Fred", "Richards", "frichards4u@drupal.org", "7 Sunfield Way", "", "", "", "public", true);
		create_score(362, "Jimmy", "Edwards", "jedwards4v@studiopress.com", "31 Lakewood Gardens Way", "", "", "", "standard_life", true);
		create_score(359, "Kenneth", "Chavez", "kchavez4w@youtube.com", "8326 Monica Hill", "", "", "", "ireland_ifa", true);
		create_score(927, "Bonnie", "Flores", "bflores4x@artisteer.com", "729 Farwell Way", "", "", "", "public", true);
		create_score(54, "Jennifer", "Wagner", "jwagner4y@google.it", "55 Caliangt Point", "", "", "", "standard_life", true);
		create_score(810, "Christina", "Burke", "cburke4z@icq.com", "7 Red Cloud Place", "", "", "", "ireland_ifa", true);
		create_score(158, "Matthew", "Porter", "mporter50@shop-pro.jp", "1 American Ash Point", "", "", "", "public", true);
		create_score(697, "Amanda", "Phillips", "aphillips51@huffingtonpost.com", "61407 Hovde Crossing", "", "", "", "standard_life", true);
		create_score(855, "Sharon", "Parker", "sparker52@trellian.com", "14641 Anderson Place", "", "", "", "ireland_ifa", true);
		create_score(637, "Terry", "Gonzalez", "tgonzalez53@taobao.com", "011 Drewry Plaza", "", "", "", "public", true);
		create_score(856, "Lisa", "Bailey", "lbailey54@1und1.de", "53 Huxley Avenue", "", "", "", "standard_life", true);
		create_score(841, "Ralph", "Gutierrez", "rgutierrez55@craigslist.org", "6873 Hazelcrest Circle", "", "", "", "ireland_ifa", true);
		create_score(447, "Margaret", "Andrews", "mandrews56@usda.gov", "6448 Armistice Hill", "", "", "", "public", true);
		create_score(286, "Gloria", "Fuller", "gfuller57@hibu.com", "506 Esch Plaza", "", "", "", "standard_life", true);
		create_score(642, "Rachel", "Scott", "rscott58@tinypic.com", "90 Mayfield Alley", "", "", "", "ireland_ifa", true);
		create_score(180, "Sandra", "Bryant", "sbryant59@flavors.me", "83653 Drewry Plaza", "", "", "", "public", true);
		create_score(579, "Billy", "Lopez", "blopez5a@typepad.com", "6 Bluejay Terrace", "", "", "", "standard_life", true);
		create_score(647, "Nicholas", "Holmes", "nholmes5b@wufoo.com", "902 Eastlawn Hill", "", "", "", "ireland_ifa", true);
		create_score(24, "Patricia", "Hudson", "phudson5c@patch.com", "8834 Arrowood Road", "", "", "", "public", true);
		create_score(670, "Margaret", "Greene", "mgreene5d@disqus.com", "2590 Sage Drive", "", "", "", "standard_life", true);
		create_score(719, "Irene", "Richards", "irichards5e@cpanel.net", "3 Warrior Trail", "", "", "", "ireland_ifa", true);
		create_score(134, "Wayne", "Arnold", "warnold5f@skyrock.com", "89 Acker Plaza", "", "", "", "public", true);
		create_score(376, "Ronald", "Wilson", "rwilson5g@g.co", "17 Thackeray Crossing", "", "", "", "standard_life", true);
		create_score(198, "Shirley", "Hudson", "shudson5h@furl.net", "22 Fordem Park", "", "", "", "ireland_ifa", true);
		create_score(698, "Samuel", "Stephens", "sstephens5i@biblegateway.com", "67 Hanson Terrace", "", "", "", "public", true);
		create_score(77, "Billy", "Powell", "bpowell5j@mediafire.com", "5 High Crossing Avenue", "", "", "", "standard_life", true);
	}
}

// Work out which API action to perform
function process_action() {
	$action = get('action');
	if (!$action) send_message('error', array('reason' => 'no_action', 'message' => 'No action specified'));

	switch($action) {
		case 'get_scores':
			get_scores(get('organisation'), get('limit'), get('email'));
			break;

		case 'create_score':
			create_score(get('score'), get('first_name'), get('last_name'), get('email'), get('address_1'), get('address_2'), get('address_3'), get('postcode'), get('organisation'), false);
			break;

		case 'update_score':
			update_score(get('email'), get('score'));
			break;

		case 'delete_score':
			delete_score(get('email'), get('password'));
			break;

		case 'delete_all_scores':
			delete_all_scores(get('organisation'), get('password'));
			break;

		case 'get_all_scores':
			get_all_scores(get('organisation'), get('password'));
			break;

		default:
			send_message('error', array('reason' => 'unknown_action', 'message' => 'Unrecognised action specified'));
			return;
	}
}

function get_scores($organisation, $limit, $email) {
	global $config;

	if (!$organisation) send_message('error', array('reason' => 'no_organisation', 'message' => 'No organisation specified'));
	if (!$limit) $limit = 10;

	$query = sprintf('
		SELECT
			AES_DECRYPT(first_name, "%s") as first_name,
			AES_DECRYPT(last_name, "%s") as last_name,
			score,
			AES_DECRYPT(email, "%s") as email
		FROM scores
		WHERE organisation = "%s"
		ORDER BY score DESC
	', $config['salt'], $config['salt'], $config['salt'], $organisation);

	// Fetch scores from database
	$scores = run_query($query)->fetchAll(PDO::FETCH_ASSOC);

	$filtered_scores = array();

	foreach ($scores as $key => $value) {
		// Add position property to the results
		$position = $key + 1;
		$value['position'] = $position;

		// Highlight current player if available
		if ($email && $value['email'] == $email) {
			$value['highlight'] = true;
		}

		// Add if we're not at the limit or it's the specified player
		if ($limit > $key || ($email && $value['email'] == $email)) {
			unset($value['email']); // Strip out the users email so it's not public
			array_push($filtered_scores, $value); // Add to our results
		}
	}

	send_message('success', array('action' => 'get_scores', 'scores' => $filtered_scores));
}

function update_score($email, $score) {
	global $config;

	if (!$email) send_message('error', array('reason' => 'no_email', 'message' => 'No email specified'));
	if (!$score) send_message('error', array('reason' => 'no_score', 'message' => 'No score specified'));

	$query = sprintf('
		SELECT *
		FROM scores
		WHERE email = AES_ENCRYPT("%s", "%s")
	', $email, $config['salt']);

	// Fetch scores from database
	$result = run_query($query)->fetchAll(PDO::FETCH_ASSOC);

	if (count($result) > 0) {
		$now = new DateTime();
		$updated = new DateTime($result[0]['created']);
		$elapsed = abs($updated->getTimestamp() - $now->getTimestamp());
		$min_elapsed = 10; // 10 seconds

		// Ensure a decent amount of time has passed between score submissions
		if ($elapsed >= $min_elapsed) {
			if ($result[0]['score'] > $score) $score = $result[0]['score']; // Only record a higher score
			$attempts = $result[0]['attempts'] + 1;

			// Update the existing database row
			$query = sprintf('
				UPDATE scores
				SET
					score = %d,
					attempts = %d,
					updated = NOW()
				WHERE email = AES_ENCRYPT("%s", "%s")
			', $score, $attempts, $email, $config['salt']);
			run_query($query);

			send_message('success', array('action' => 'update_score'));
		} else {
			send_message('error', array('reason' => 'rate_limiting', 'message' => 'Too soon since last submission', 'elapsed' => $elapsed));
		}
	} else {
		send_message('error', array('reason' => 'player_not_found', 'message' => 'Existing player not found'));
	}
}

function create_score($score, $first_name, $last_name, $email, $address_1, $address_2, $address_3, $postcode, $organisation, $internal) {
	global $config;

	if (!$score)        send_message('error', array('reason' => 'no_score', 'message' => 'No score specified'));
	if (!$first_name)   send_message('error', array('reason' => 'no_first_name', 'message' => 'No first name specified'));
	// if (!$last_name)    send_message('error', array('reason' => 'no_last_name', 'message' => 'No last name specified'));
	if (!$email)        send_message('error', array('reason' => 'no_email', 'message' => 'No email specified'));
	// if (!$address_1)    send_message('error', array('reason' => 'no_address_1', 'message' => 'No address 1 specified'));
	if (!$organisation) send_message('error', array('reason' => 'no_organisation', 'message' => 'No organisation specified'));

	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) send_message('error', array('reason' => 'invalid_email', 'message' => 'Invalid email supplied'));

	$query = sprintf('
		SELECT *
		FROM scores
		WHERE email = AES_ENCRYPT("%s", "%s")
	', $email, $config['salt']);

	// Check whether an existing score for this player already exists
	if (exists_query($query)) {
		update_score($email, $score);
	} else {
		$ip_address = get_ip();

		if (!$internal) {
			$profanity_found = profanity_check($first_name . ' ' . $last_name);
		} else {
			$profanity_found = false;
		}

		// Create a new entry
		$query = sprintf('
			INSERT INTO scores
				(score, first_name, last_name, email, address_1, address_2, address_3, postcode, organisation, attempts, created, updated, ip_address, profanity)
			VALUES
				(%d, AES_ENCRYPT("%s", "%s"), AES_ENCRYPT("%s", "%s"), AES_ENCRYPT("%s", "%s"), AES_ENCRYPT("%s", "%s"), AES_ENCRYPT("%s", "%s"), AES_ENCRYPT("%s", "%s"), AES_ENCRYPT("%s", "%s"), "%s", 1, NOW(), NOW(), "%s", %d)
		', $score, $first_name, $config['salt'], $last_name, $config['salt'], $email, $config['salt'], $address_1, $config['salt'], $address_2, $config['salt'], $address_3, $config['salt'], $postcode, $config['salt'], $organisation, $ip_address, ($profanity_found ? 1 : 0));
		run_query($query);

		if (!$internal) {
			send_message('success', array('action' => 'create_score'));
		}
	}
}

function profanity_check($value) {
	if ($value == '') {
		return false;
	}

	$censor = new CensorWords;
	$badwords = $censor->setDictionary(array('en-base', 'en-uk', 'en-us'));
	$string = $censor->censorString($value);

	// True == Swear word found
	return ($string['orig'] != $string['clean']);
}