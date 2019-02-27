class Ship {
    constructor(name, crew, fuel, hull, speed, img) {
        this.name = name;
        this.crew = crew;
        this.fuel = fuel;
        this.maxFuel = fuel;
        this.hull = hull;
        this.maxHull = hull;
        this.speed = speed;
        this.credits = 500;
        this.img = img;
        this.isWorking = false;
        this.isDamaged = false;
        this.isDestroyed = false;
        this.dockedPlanet = null;


    }
    async start(planet) {
        if (planet instanceof Planet) {
            let ship = planet.shipDocked.includes(this)
            if (ship == false) {
                if (this.isDamaged == false) {
                    if (this.isDestroyed == false) {
                        if (this.crew !== 0) {
                            if (this.fuel >= (planet.distance * 20)) {
                                console.log(`Ship is traveling to the planet...`)
                                this.isWorking = true;
                                let self1 = this;
                                let travelTime = planet.distance * 1000 / self1.speed;
                                let eventArr = SpaceEvent.generateEvents(travelTime, spaceEvents);
                                for (const ev of eventArr) {
                                    await ev.startEvent(this);
                                }
                                setTimeout(function () {
                                    self1.fuel = self1.fuel - (planet.distance * 20)
                                    self1.dock(planet);
                                }, planet.distance * 1000 / self1.speed)
                            } else {
                                console.log(`Ship doesn't have enaugh fuel! Please refuel!`);
                            }
                        } else {
                            console.log(`This ship has no Crew to guide him through the galaxy! Please hire new crew!`);
                        }
                    } else {
                        console.log(`This ship has been destroyed! Game over!`);
                    }
                } else {
                    console.log(`This ship has been damaged. Please repair it before going on voyage`);
                }
            } else {
                console.log(`Ship is alredy docked on this planet!`);
            }
        } else {
            console.log(`Invalid planet! Choose new planet to travel!`);
        }
    }
    dock(planet) {
        let self = this;
        console.log(`Ship is docking on the planet...`)
        setTimeout(function () {
            console.log(`Ship is docked on the planet...`)
            planet.shipDocked.push(self)
            self.isWorking = false;
            self.dockedPlanet = planet;
        }, 2000)
    }

    stats() {
        console.log("----------- SHIP STATS-----------");
        console.log(`CREW: ${this.crew}`);
        console.log(`FUEL: ${this.fuel}/${this.maxFuel}`);
        console.log(`HULL: ${this.hull}/${this.maxHull}`);
        console.log(`CREDITS: ${this.credits}`);
    }
}




class Planet {
    constructor(name, size, population, distance, development, img) {
        this.name = name;
        this.size = size;
        this.population = population;
        this.distance = distance;
        this.shipDocked = [];
        this.development = development;
        this.img = img;
    }

    getMarketPrice(price) {
        return price = this.development * price - Math.floor(this.population / this.size);
    }



    repair(ship) {
        if (ship instanceof Ship) {
            let shipDock = this.shipDocked.includes(ship)
            if (shipDock == true) {
                if (ship.hull !== ship.maxHull) {
                    if (ship.credits >= this.getMarketPrice(price.repair)) {
                        ship.credits = ship.credits - this.getMarketPrice(price.repair);
                        ship.isDamaged = false;
                        ship.hull = ship.maxHull;
                        console.log(`Ship has been fully repaired!`);
                    } else {
                        console.log(`Ship doesn't have the required credits for this repair!`);
                    }
                } else {
                    console.log(`Ship's hull is at maximum strength!`);
                }
            } else {
                console.log(`Ship is not docked at this planet!`);
            }
        } else {
            console.log(`Invalid chosen ship!`);
        }
    }

    refuel(ship) {
        if (ship instanceof Ship) {
            let shipDock = this.shipDocked.includes(ship)
            if (shipDock == true) {
                if (ship.fuel !== ship.maxFuel) {
                    if (ship.credits >= this.getMarketPrice(price.fuel)) {
                        ship.credits = ship.credits - this.getMarketPrice(price.fuel);
                        ship.fuel = ship.maxFuel;
                        console.log(`Ship has been fully loaded!`);
                    } else {
                        console.log(`Ship doesn't have the required credits for this refuel!`);
                    }
                } else {
                    console.log(`Ship's fuel is at maximum strength!`);
                }
            } else {
                console.log(`Ship is not docked at this planet!`);
            }
        } else {
            console.log(`Invalid chosen ship!`);
        }
    }

    hireCrewMember(ship) {
        if (ship instanceof Ship) {
            let shipDock = this.shipDocked.includes(ship)
            if (shipDock == true) {
                if (ship.credits >= this.getMarketPrice(price.crew)) {
                    ship.credits = ship.credits - this.getMarketPrice(price.crew);
                    ship.crew = ship.crew + 1;
                    console.log(`A new crew member has been added to this Ship!`);
                } else {
                    console.log(`Ship doesn't have the required credits to hire new crew member!`);
                }
            } else {
                console.log(`Ship is not docked at this planet!`);
            }
        } else {
            console.log(`Invalid chosen ship!`);
        }
    }
}


class SpaceEvent {
    constructor(name, description, crewModifier, fuelModifier, hullModifier) {
        this.name = name;
        this.description = description;
        this.crewModifier = crewModifier;
        this.fuelModifier = fuelModifier;
        this.hullModifier = hullModifier;

    }
    startEvent(ship) {
        console.log(ship);
        return new Promise((resolve, reject) => {
            if (ship instanceof Ship) {
                let that = this;
                setTimeout(() => {
                    if (that.crewModifier !== 0) {
                        if (that.crewModifier > 0) {
                            ship.crew + that.crewModifier;
                            console.log(`Your crew god bigger. Now it counts: ${ship.crew}`);
                        } else {
                            ship.crew = ship.crew - that.crewModifier;
                            console.log(`Your crew got smaller. Now it counts: ${ship.crew}`);
                            
                        }
                    }
                    if (that.fuelModifier !== 0) {
                        if (that.fuelModifier > 0) {
                            ship.fuel = ship.fuel + that.fuelModifier;
                            console.log(`Your fuel got refilled. Now you have fuel: ${ship.fuel}`);
                        } else {
                            ship.fuel = ship.fuel - that.fuelModifier;
                            console.log(`You lose fuel. Now you have fuel: ${ship.fuel}`);
                        }
                    }
                    if (that.hullModifier !== 0) {
                        if (that.hullModifier > 0) {
                            ship.hull = ship.hull + that.hullModifier;
                            console.log(`Your hull got repaired. Now your hull is: ${ship.hull}`);
                        } else {
                            ship.hull = ship.hull - that.hullModifier;
                            console.log(`You lose hull. Now your hull is: ${ship.hull}`);
                        }
                    }
                    resolve();
                }, 4000);
            } else {
                reject("This is not a ship!");
            }
        })
    }
    static generateEvents(time, arr) {
        let eventIndex = 1;
        let newArray = [];
        if (time > 26000) {
            eventIndex = 4;
        } else if (time > 18000) {
            eventIndex = 3;
        } else if (time > 8000) {
            eventIndex = 2;
        } else {
            eventIndex;
        }
        for (let i = 0; i < eventIndex; i++) {
            newArray.push(arr[Math.floor(Math.random() * arr.length)]);
        }
        console.log(newArray);
        return newArray;
    }
}

let price = {
    fuel: 50,
    repair: 60,
    crew: 80
}

let planets = [
    new Planet("Rubicon9", 300000, 2000000, 4, 2, "img/Rubicon9.png"),
    new Planet("R7", 120000, 4000000, 7, 3, "img/R7.png"),
    new Planet("Magmus", 500000, 10000000, 6, 1, "img/Magmus.png"),
    new Planet("Dextriaey", 50000, 500000, 9, 3, "img/Dextriaey.png"),
    new Planet("B18-1", 250000, 4000000, 12, 2, "img/B18-1.png")
]

let ships = [
    new Ship("StarFighter", 3, 380, 500, 0.5, "img/StarFighter.png"),
    new Ship("Crushinator", 5, 540, 400, 0.2, "img/Crushinator.png"),
    new Ship("Scouter", 1, 300, 300, 0.9, "img/Scouter.png")
]


let spaceEvents = [
    new SpaceEvent("Fuel Leak", "Due to low maintenance of the ship, the fuel tank leaked. The leak was patched, but we lost some fuel.", 0, -50, 0),
    new SpaceEvent("Pirates!", "Space pirates attacked the ship! We escaped, but our hull took some damage!", 0, -20, -150),
    new SpaceEvent("Unknown substance", "An unknown substance was found on the cargo ship. A crew member touched it and died on the spot.", -1, 0, 0),
    new SpaceEvent("Asteroid field", "We entered an asteroid field. It was hard, but our captain managed to go out of it.", 0, -30, -100),
    new SpaceEvent("Fire on deck", "The main system overheated and fire broke from one of the panels. The crew quickly extinguished it.", 0, 0, -70),
    new SpaceEvent("Bad stop", "You stop at a nearby station for a pit-stop. They give you repair supplies.", 0, -50, +50),
    new SpaceEvent("Captains Birthday", "It's the captain's birthday. Everybody got drunk. Nobody remembers what happened the last 12 hours.", -1, -60, -100),
    new SpaceEvent("Space Shark", "Your ship is attacked by a space shark. After killing it, you watch a tutorial on how to turn shark blood in to fuel.", 0, +80, -120),
    new SpaceEvent("Alien in need", "An alien is stranded on it's broken ship. It took some time and effort but you save him and board him on your ship.", 1, -50, -50),
    new SpaceEvent("Hail the federation", "A federation cruiser hails you. They help you with supplies and fuel.", 0, +100, +100),
    new SpaceEvent("Destroyed Transport Ship", "You encounter a destroyed transport ship. It's dangerous, but you try salvaging its fuel tank.", 0, +150, -80),
    new SpaceEvent("Angry Spider", "An angry spider appears on the deck. The captain stomps on it. Everything is fine", 0, 0, 0)
];


let selectedShip = "";
let shipId = "";

document.getElementById("shipsdiv").addEventListener(`click`, (e) => {
    e.preventDefault();
    $("allPlanets").show();
    let value = e.target.getAttribute(`value`);
    if (value === "crush") {
        selectedShip = ships[1];
        shipId = "crushImg"
        $("#scouter").hide();
        $("#starfighter").hide();
        $("#btnCrush").hide();
    } else if (value === "scouter") {
        selectedShip = ships[2];
        shipId = "scouterImg"
        $("#crush").hide();
        $("#starfighter").hide();
        $("#btnScouter").hide();
    } else if (value === "starfighter") {
        selectedShip = ships[0];
        shipId = "starfighterImg"
        $("#scouter").hide();
        $("#crush").hide();
        $("#btnStarfighter").hide();
    }
    return selectedShip, shipId;
})

document.getElementById("div1").addEventListener(`click`, (e) => {
    e.preventDefault();
    let value = e.target.getAttribute("value");
    if (value === "repair") {
        planets[0].repair(selectedShip, price.repair);
    } else if (value === "refuel") {
        planets[0].refuel(selectedShip, price.refuel);
    } else if (value === "hire") {
        planets[0].hireCrewMember(selectedShip, price.crew);
    } else if (value === "stats") {
        selectedShip.stats();
    } else if (value === "goto") {
        selectedShip.start(planets[0]);
    }
})

document.getElementById("div2").addEventListener(`click`, (e) => {
    e.preventDefault();
    let value = e.target.getAttribute("value");
    if (value === "repair") {
        planets[2].repair(selectedShip, price.repair);
    } else if (value === "refuel") {
        planets[2].refuel(selectedShip, price.refuel);
    } else if (value === "hire") {
        planets[2].hireCrewMember(selectedShip, price.crew);
    } else if (value === "stats") {
        selectedShip.stats();
    } else if (value === "goto") {
        selectedShip.start(planets[2]);
    }
})

document.getElementById("div3").addEventListener(`click`, (e) => {
    e.preventDefault();
    let value = e.target.getAttribute("value");
    if (value === "repair") {
        planets[1].repair(selectedShip, price.repair);
    } else if (value === "refuel") {
        planets[1].refuel(selectedShip, price.refuel);
    } else if (value === "hire") {
        planets[1].hireCrewMember(selectedShip, price.crew);
    } else if (value === "stats") {
        selectedShip.stats();
    } else if (value === "goto") {
        selectedShip.start(planets[1]);
    }
})

document.getElementById("div4").addEventListener(`click`, (e) => {
    e.preventDefault();
    let value = e.target.getAttribute("value");
    if (value === "repair") {
        planets[3].repair(selectedShip, price.repair);
    } else if (value === "refuel") {
        planets[3].refuel(selectedShip, price.refuel);
    } else if (value === "hire") {
        planets[3].hireCrewMember(selectedShip, price.crew);
    } else if (value === "stats") {
        selectedShip.stats();
    } else if (value === "goto") {
        selectedShip.start(planets[3]);
    }
})

document.getElementById("div5").addEventListener(`click`, (e) => {
    e.preventDefault();
    let value = e.target.getAttribute("value");
    if (value === "repair") {
        planets[4].repair(selectedShip, price.repair);
    } else if (value === "refuel") {
        planets[4].refuel(selectedShip, price.refuel);
    } else if (value === "hire") {
        planets[4].hireCrewMember(selectedShip, price.crew);
    } else if (value === "stats") {
        selectedShip.stats();
    } else if (value === "goto") {
        selectedShip.start(planets[4]);
    }
})