// Maual tempratuare setting to the device

class AutoTemprature {
    constructor(currentTemperature, deviceTempraure, typeTempratureMode) {
        this.currentTemperature = currentTemperature;
        this.deviceTempraure = deviceTempraure;
        this.typeTempratureMode = typeTempratureMode;
    };
    setTemperatureMode() {
       // value returns celcius 
        switch (this.typeTempratureMode) {
           
            //refreshed: Cold
            case "cold":
                return 6

            //rapid hydration: Slightly chilled
            case "slightlyChilled":
                return 16

            //quenching thirst: Lukewarm
            case "room":
                return 20

            // rapid hydration: Slightly chilled
            case "lukemWarm":
                return 40 

            default:
                return 21
                
        }
    }
}

 
module.exports = AutoTemprature;