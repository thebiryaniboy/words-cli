const request = require('request')
const fs = require('fs');

// const config = require('../config').credentials

const oxford = {
    'BASE_URL': 'https://od-api.oxforddictionaries.com/api/v1'
}

let Headers = {}
let playData = {
    word: '',
    data: []
}
// const Types = ['antonyms', 'synonyms', 'examples', 'definitions', 'word', 'play']



const generateUrl = (word, t) => {
    const ext = t ? '/' + t : ''
    const Url = oxford.BASE_URL + '/entries/en/' + word.toLowerCase() + ext
    // console.log(Url)
    return Url
}

const HTTP_Request = (word, t, play) => {
    // validation(t)
    request({
        headers: Headers,
        uri: generateUrl(word, t),
        method: 'GET'
    }, (err, res, body) => {
        //it works!
        if (err) console.log(err +' : 80')
        if (res.statusCode === 404) console.log('Error : Keyword not found. --- '+ t)
        else if (res.statusCode === 500) console.log('Error : Internal Error. Try again. --- '+ t)
        else dataMap(body, t, play)
    });
    
}

const dataMap = (array, key, play) => {
    // console.log(key +' : '+JSON.stringify(array))
        try {
            
            let arr = JSON.parse(array).results[0].lexicalEntries[0].entries[0].senses
            arr = arr.map(x => x[key])
            arr = [].concat(...arr)
            if (key !== 'definitions') arr = arr.map(x => x.text)
            if (!play) {
                console.log('')
                console.log(key +' : '+arr[0])
                console.log('')
            } else {
                console.log('')
                console.log(key +' : '+ arr)
                console.log('')
            }
            
        } catch (error) {
            console.log('')
            console.log('Error : Could not read data ---- ' + key)
            console.log('')
        }

}


module.exports = {
    checkCredentials: () => {
        if (!process.env['APP_ID'] || !process.env['APP_KEY']) {
            console.log('')
            console.log('Error : APP_ID or APP_KEY or Both are missing')
            console.log('')
            console.log('To set APP_ID & APP_KEY please follow README.md file')
            process.exit()
        } else {
            Headers = {
                'Accept': 'application/json',
                'app_id': process.env['APP_ID'],
                'app_key': process.env['APP_KEY']
            }
        }
    }  ,
    data: (word, t, play) => {
        if (play) {
            t.forEach(element => {
                HTTP_Request(word, element,play)
            })
        } else {
            t.forEach(element => {
                HTTP_Request(word, element,)
            })
        }
    }
}

