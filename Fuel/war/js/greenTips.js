var tips =[
 {title: "CHANGE YOUR LIGHT",
  text: "If every household in the United State replaced one regular lightbulb with one of those new compact fluorescent bulbs, the pollution reduction would be equivalent to removing one million cars from the road."},
 {title: "DON'T RINSE",
  text: "Skip rinsing dishes before using your dishwasher and save up to 20 gallons of water each load. Plus, you're saving time and the energy used to heat the additional water."},
 {title: "DO NOT PRE-HEAT THE OVEN",
  text: "Unless you are making bread or pastries of some sort, don't pre-heat the oven. Just turn it on when you put the dish in. Also, when checking on your food, look through the oven window instead of opening the door."},
 {title: "RECYCLE GLASS",
  text: "Recycled glass reduces related air pollution by 20 percent and related water pollution by 50 percent. If it isn't recycled it can take a million years to decompose."},
 {title: "HANG DRY",
  text: "Get a clothesline or rack to dry your clothes by the air. Your wardrobe will maintain color and fit, and you'll save money."},
 {title: "PLANT A TREE",
  text: "It's good for the air, the land, can shade your house and save on cooling (plant on the west side of your home), and they can also improve the value of your property."},
 {title:"GIVE IT AWAY",
  text: "Before you throw something away, think about if someone else might need it. Either donate to a charitable organization or post it on a web site designed to connect people and things, such as Freecycle.org."}
 ,{title: "GET MY D",
  text: "SUCK MY FAT COCK"}
];
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function doTips(){
	setTimeout(function(){
	var r= getRandomInt(0,7);
	$("#tipText").animate({opacity: 0});
	$("#tipTitle").animate({opacity:0},function(){
		$("#tipTitle").text("Tip: "+ tips[r].title);
		$("#tipText").text(tips[r].text);
		$("#tipText").animate({opacity:1});
		$("#tipTitle").animate({opacity:1},
			function(){
				doTips();
			});
		});
	}, 7500);
	

}
$(document).ready(function(){
	doTips();
});
