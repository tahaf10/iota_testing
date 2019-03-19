const Iota = require('@iota/core');
const Converter = require('@iota/converter');
// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const iota = Iota.composeAPI({
provider: 'https://nodes.devnet.iota.org:443'
});
// Call the `getNodeInfo()` method for information about the IRI node
/*iota.getNodeInfo()
    // Convert the returned object to JSON to make the output more readable
    .then(info => console.log(JSON.stringify(info)))
    .catch(err => {
        // Catch any errors
        console.log(err);
    });
*/

const seed = 'WFDHDHZPCLQCVL9NKEFYFMLQQJLNYFVWRCKWLIGGRMYMFWYVMTF9W9INFRYHYYZZFUMDCANODEB9LAUOL';
const controller = {

    generateNewAddress: async (seed)=> {
       //const address = await iota.getNewAddress (seed);
       var options = {
        index: 0,
        checksum: false
        }
        const address = await iota.getNewAddress(seed,options);
        return address;
    },

    checkBalanceThroughSeed: (seed)=> {
        var addresses = new Set();
        var allAddresses;

        iota.getNewAddress(seed, {'returnAll':true}, function(error, allAddresses) {
	        if(error) {
                console.log(error)
            } else {
                allAddresses.forEach(function(addr) { addresses.add(addr)})
                console.log(allAddresses)
                iota.getBalances(allAddresses, 10, function(error, success) {
                        if(error) {
                                console.log(error)
                        }else {
                                console.log(success)
                     }
                })
            }
        });
    },

    checkBalance: (address)=> {
        iota.getBalances(address, 10, function(error, result) {
            if(error) {
                    console.log(error)
            }else {
                    console.log(result.balances)
            }
        });
    },

    transfer: (seed,address)=> {

        const message = Converter.asciiToTrytes('test tx');
        const transfers = [
            {
                value: 1,
                address: address,
                message: message
            }
        ];

        iota.prepareTransfers(seed, transfers)
        .then(trytes => {
            return iota.sendTrytes(trytes, 3, 9)
        })
        .then(bundle => {
            console.log(`Published transaction with tail hash: ${bundle[0].hash}`);
            var JSONBundle = JSON.stringify(bundle);
            console.log(`Bundle: ${JSONBundle}`)
        })
        .catch(err => {
        // Catch any errors
        console.log(err);
        });

    },

    getWallet: async ()=> {
        var addresses = [];
        var returnString;

        await iota.getNewAddress(seed, {'returnAll':true}, function(error, allAddresses) {
	        if(error) {
                console.log(error);
            } else {
                allAddresses.forEach(function(addr) { addresses.push(addr)});
                console.log(addresses);
                returnString = {
                    'seed': seed,
                    'addresses': addresses
                }
        
            }
        });
        return returnString;
    }
};

//controller.generateNewAddress('WFDHDHZPCLQCVL9NKEFYFMLQQJLNYFVWRCKWLIGGRMYMFWYVMTF9W9INFRYHYYZZFUMDCANODEB9LAUOL')
//   .then(address => console.log(address));

//controller.checkBalanceThroughSeed('WFDHDHZPCLQCVL9NKEFYFMLQQJLNYFVWRCKWLIGGRMYMFWYVMTF9W9INFRYHYYZZFUMDCANODEB9LAUOL');

//controller.checkBalance(['X9LDWTNYHMIZ9KALJNY9PGABMMZVCSXFSUXXA9BHLGFMJELEJNFXGMMOBPHAWTBPGXJNPSGRWJGWWRLTY']);

//controller.checkBalance(['DSB9UHMUGXM9EQSEWFJGCQMVUSCAZAGHMYBUPDGODJDWSWHEMRLZVQHNOHQWBBIDXBOVKLEPIQHBDRTBW']);

//controller.transfer('WFDHDHZPCLQCVL9NKEFYFMLQQJLNYFVWRCKWLIGGRMYMFWYVMTF9W9INFRYHYYZZFUMDCANODEB9LAUOL','HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD');

var x = controller.getWallet();
console.log(x);