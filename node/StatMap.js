// Object to hash and store player names and corresponding stats[key] value 
class StatMap {
    constructor() {
    this.list = [];
  }

  hash(str) {
    let hash = 0;
    if (str.length == 0){
        return hash;
    }
    for (let i = 0; i < str.length; i++) { // consider declaring i as a variable accessible to the whole object, may be better practice, research
        let char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
  }

  get(x) { 
    let j = this.hash(x.toLowerCase());
    let result = this.list[j];
    
    if(!result){
        return -1;  
    }
    else { //puts all outputs into an array for simpler processing in playerSearch, doubles performance time on a MDN page from .29 ms to .50ms, 
          //a seemingly negligable difference to my beginner eyes. removes need to check typeof in playerSearch 
        return result.reduce(function(all, item, index){
            all.push(item[1]);
            return all;
        }, [])
    }   //No need to deal with duplicates here as this is expected due to common names 
  }

  set(x, y) {
    let i = this.hash(x);

    if(!this.list[i]) {
        this.list[i] = [];
    }

    this.list[i].push([x, y]);
  }

  setHashAll(arr){  
    for(let i = 0; i < arr.length; i++){  //is arr.legnth fine? Or does it need to be length-1? Try with small sample array see if you are adding garbage values 
        let x = this.hash(arr[i].toLowerCase())

        if(!this.list[x]){
            this.list[x] = [];
        }

        this.list[x].push([x, i]); 
    }
  }

  playerSearch(arr, location){ //added location so script can run getData(arr, location) in a file that does not contain the stats file.
    let fullMatches = [];
    let searchedHash;
    let secondHash;

     for(let i = 0; i < (arr.length - 1); i++){
        searchedHash = this.get(arr[i]);
        secondHash = this.get(arr[(i + 1)]); 

        if(searchedHash != -1 && secondHash != -1){
             fullMatches.push(searchedHash.filter(element => secondHash.includes(element)));
        }
    }
    return this.getData(fullMatches.filter(element => element.length >= 1), location); 
  }

  getData(arr, location){ // Get data from location (which is entered, as of now, in the playerSearch function. Need to determine format and ultimate location once architecture is clearer. this function will need to be rewritten to access stats location later on in development 
       let statArr = [];

       arr.forEach(element => statArr.push(location[element]));
       return statArr;
  }
}

module.exports = new StatMap;