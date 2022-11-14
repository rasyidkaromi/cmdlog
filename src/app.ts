
import fs from 'fs';
import { parse } from 'csv-parse';
import fetch from 'node-fetch'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'


const key = '5bc4dc7bda2b1449159e5db643d7123b56018896db1702bcb5aab9c442610305'
const file = 'transactions.csv'

type streamBufferType = {
    timestamp: string
    transaction_type: string
    token: string
    amount: string
    amountUSD: string
}

type allStreamBufferType = {
    timestamp: string
    transaction_type: string
    token: string
    amount: string
}

class Service {
    private args: any
    private serviceApi: string
    private serviceStreamCSVData: any
    private timeStart: number

    private allStreamBufferArray: Array<allStreamBufferType>
    private allStreamBufferObject: allStreamBufferType
    private allStreamBTCBufferArray: Array<allStreamBufferType>
    private allStreamETHBufferArray: Array<allStreamBufferType>
    private allStreamXRPBufferArray: Array<allStreamBufferType>

    private streamBTCBufferJson: streamBufferType
    private streamETHBufferJson: streamBufferType
    private streamXRPBufferJson: streamBufferType


    constructor() {
        this.args = yargs(hideBin(process.argv)).argv;
        this.serviceApi = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC,XRP&tsyms=USD&api_key=' + key
        this.serviceStreamCSVData = fs.createReadStream(file).pipe(parse({ delimiter: ",", from_line: 2 }))
        this.timeStart = new Date().getTime();

        this.allStreamBufferArray = []
        this.allStreamBTCBufferArray = []
        this.allStreamETHBufferArray = []
        this.allStreamXRPBufferArray = []
        this.allStreamBufferObject = {} as allStreamBufferType

        this.streamBTCBufferJson = {} as streamBufferType
        this.streamETHBufferJson = {} as streamBufferType
        this.streamXRPBufferJson = {} as streamBufferType

    }

    async initCmnd() {
        this.logInfo()
        this.allStreamBufferArray = []
        this.allStreamBTCBufferArray = []
        this.allStreamETHBufferArray = []
        this.allStreamXRPBufferArray = []

        this.serviceStreamCSVData.on('data', (data: any[]) => {

            this.allStreamBufferObject = {} as allStreamBufferType
            this.streamBTCBufferJson = {} as streamBufferType
            this.streamETHBufferJson = {} as streamBufferType
            this.streamXRPBufferJson = {} as streamBufferType


            this.allStreamBufferObject.timestamp = data[0]
            this.allStreamBufferObject.transaction_type = data[1]
            this.allStreamBufferObject.token = data[2]
            this.allStreamBufferObject.amount = data[3]
            this.allStreamBufferArray.push(this.allStreamBufferObject)

            switch (data[2]) {
                case 'BTC':
                    this.streamBTCBufferJson.timestamp = data[0]
                    this.streamBTCBufferJson.transaction_type = data[1]
                    this.streamBTCBufferJson.token = data[2]
                    this.streamBTCBufferJson.amount = data[3]
                    this.allStreamBTCBufferArray.push(this.streamBTCBufferJson)
                    break;
                case 'ETH':
                    this.streamETHBufferJson.timestamp = data[0]
                    this.streamETHBufferJson.transaction_type = data[1]
                    this.streamETHBufferJson.token = data[2]
                    this.streamETHBufferJson.amount = data[3]
                    this.allStreamETHBufferArray.push(this.streamETHBufferJson)
                    break;
                case 'XRP':
                    this.streamXRPBufferJson.timestamp = data[0]
                    this.streamXRPBufferJson.transaction_type = data[1]
                    this.streamXRPBufferJson.token = data[2]
                    this.streamXRPBufferJson.amount = data[3]
                    this.allStreamXRPBufferArray.push(this.streamXRPBufferJson)
                    break;
            }
        })

        if (this.args.token && this.args.date) {
            let resultTokenandData: any = await this.getfromTokenandDate()
            console.log(resultTokenandData)
            this.timeLapse()
            return
        }
        if (this.args.token) {
            let latesToken: any = await this.getLatesfromToken()
            console.log(latesToken)
            this.timeLapse()
            return
        }
        if (this.args.date) {
            let resultDate: any = await this.getfromDate()
            console.log(resultDate)
            this.timeLapse()
            return
        }

        let resltLatest = await this.getLatest()
        console.log(resltLatest)
        this.timeLapse()
        return

    }

    private async getLatest() {

        this.streamBTCBufferJson = {} as streamBufferType
        this.streamETHBufferJson = {} as streamBufferType
        this.streamXRPBufferJson = {} as streamBufferType

        let localBuffer: any = []
        return new Promise(async (resolve) => {
            this.serviceStreamCSVData.on('close', async () => {

                let btcLates = this.allStreamBTCBufferArray.reduce((pre, current) => Number(pre.timestamp) > Number(current.timestamp) ? pre : current);
                let ethLates = this.allStreamETHBufferArray.reduce((pre, current) => Number(pre.timestamp) > Number(current.timestamp) ? pre : current);
                let xrpLates = this.allStreamXRPBufferArray.reduce((pre, current) => Number(pre.timestamp) > Number(current.timestamp) ? pre : current);

                let priceData = await this.fetchUsd()
                if (priceData.result) {

                    this.streamBTCBufferJson.timestamp = btcLates.timestamp
                    this.streamBTCBufferJson.transaction_type = btcLates.transaction_type
                    this.streamBTCBufferJson.token = btcLates.token
                    this.streamBTCBufferJson.amount = btcLates.amount
                    this.streamBTCBufferJson.amountUSD = (Number(btcLates.amount) * priceData.data.BTC.USD).toString()

                    this.streamETHBufferJson.timestamp = ethLates.timestamp
                    this.streamETHBufferJson.transaction_type = ethLates.transaction_type
                    this.streamETHBufferJson.token = ethLates.token
                    this.streamETHBufferJson.amount = ethLates.amount
                    this.streamETHBufferJson.amountUSD = (Number(ethLates.amount) * priceData.data.ETH.USD).toString()

                    this.streamXRPBufferJson.timestamp = xrpLates.timestamp
                    this.streamXRPBufferJson.transaction_type = xrpLates.transaction_type
                    this.streamXRPBufferJson.token = xrpLates.token
                    this.streamXRPBufferJson.amount = xrpLates.amount
                    this.streamXRPBufferJson.amountUSD = (Number(xrpLates.amount) * priceData.data.XRP.USD).toString()

                    localBuffer.push(this.streamBTCBufferJson)
                    localBuffer.push(this.streamETHBufferJson)
                    localBuffer.push(this.streamXRPBufferJson)

                    resolve(localBuffer)

                } else {

                    resolve(localBuffer)

                }
            });
        })
    }

    private async getLatesfromToken() {

        this.streamBTCBufferJson = {} as streamBufferType
        this.streamETHBufferJson = {} as streamBufferType
        this.streamXRPBufferJson = {} as streamBufferType

        let localBuffer: any = []

        return new Promise(async (resolve) => {

            this.serviceStreamCSVData.on('close', async () => {
                let priceData = await this.fetchUsd()
                if (priceData.result) {

                    localBuffer = this.allStreamBufferArray
                        .filter((t) => t.token === this.args.token)
                        .reduce((pre, current) => Number(pre.timestamp) > Number(current.timestamp) ? pre : current)

                    localBuffer.amountUSD = (Number(localBuffer.amount) * this.priceTokenType(localBuffer.token, priceData.data)).toString()

                    resolve(localBuffer)

                } else {

                    resolve(localBuffer)

                }
            });

        })
    }

    private async getfromDate() {

        const dateObject = new Date(this.args.date);
        let thisTime = dateObject.getTime()
        let addonedayTime = thisTime + (3600 * 1000 * 24)
        let localBuffer: any = []

        return new Promise(async (resolve) => {
            this.serviceStreamCSVData.on('close', async () => {
                let priceData = await this.fetchUsd()
                if (priceData.result) {

                    let rangeByDate = this.allStreamBufferArray
                        .filter((o) => Number(o.timestamp) >= (thisTime / 1000) && Number(o.timestamp) <= (addonedayTime / 1000))
                        .map(obj => ({ ...obj, amountUSD: (Number(obj.amount) * this.priceTokenType(obj.token, priceData.data)).toString() }))

                    resolve(rangeByDate)

                } else {

                    resolve(localBuffer)

                }
            })
        })
    }

    private async getfromTokenandDate() {

        const dateObject = new Date(this.args.date);
        let thisTime = dateObject.getTime()
        let addonedayTime = thisTime + (3600 * 1000 * 24)
        let localBuffer: any = []

        return new Promise(async (resolve) => {
            this.serviceStreamCSVData.on('close', async () => {
                let priceData = await this.fetchUsd()
                if (priceData.result) {

                    let rangeByDate = this.allStreamBufferArray
                        .filter((o) => Number(o.timestamp) >= (thisTime / 1000) && Number(o.timestamp) <= (addonedayTime / 1000)).filter((t) => t.token === this.args.token)

                    switch (this.args.token) {
                        case 'BTC':
                            let btcbuffer = rangeByDate.map(obj => ({ ...obj, amountUSD: (Number(obj.amount) * this.priceTokenType(obj.token, priceData.data)).toString() }))
                            resolve(btcbuffer)
                            break;
                        case 'ETH':
                            let ethbuffer = rangeByDate.map(obj => ({ ...obj, amountUSD: (Number(obj.amount) * this.priceTokenType(obj.token, priceData.data)).toString() }))
                            resolve(ethbuffer)
                            break;
                        case 'XRP':
                            let xrpbuffer = rangeByDate.map(obj => ({ ...obj, amountUSD: (Number(obj.amount) * this.priceTokenType(obj.token, priceData.data)).toString() }))
                            resolve(xrpbuffer)
                            break;
                    }
                } else {

                    resolve(localBuffer)

                }
            })
        })
    }

    private async fetchUsd() {
        try {
            const response = await fetch(this.serviceApi)
            const json = await response.json()
            return {
                result: true,
                data: json
            }
        } catch (error) {
            return {
                result: false,
                data: error
            }
        }
    }

    private priceTokenType(token: string, price: any) {
        switch (token) {
            case 'BTC':
                return price.BTC.USD
            case 'ETH':
                return price.ETH.USD
            case 'XRP':
                return price.XRP.USD
        }
    }

    private logInfo() {
        console.log('\n')
        console.log('please wait, it takes time between 1 minute to 3 minutes')
        console.log('\n')
    }

    private timeLapse() {
        console.log('\n')
        let elapsed = new Date().getTime() - this.timeStart;
        console.log('time elapsed => ', this.millisToMinutesAndSeconds(elapsed), ' minute')
        console.log('\n')
    }

    private millisToMinutesAndSeconds(millis: any) {
        let minutes = Math.floor(millis / 60000);
        let seconds: number = Number(((millis % 60000) / 1000).toFixed(0));
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

}

const service = new Service()
service.initCmnd()

