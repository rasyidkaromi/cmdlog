
import fs from 'fs';
import fetch from 'node-fetch'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'


const key = '5bc4dc7bda2b1449159e5db643d7123b56018896db1702bcb5aab9c442610305'
const file = 'transactions.csv'

type allStreamBufferType = {
    timestamp: string
    transaction_type: string
    token: string
    amount: string
}

class Service {
    private args: any
    private serviceApi: string
    private serviceApiBTCwithDate: string
    private serviceApiETHwithDate: string
    private serviceApiXRPwithDate: string
    private serviceStreamCSVData: any
    private timeStart: number

    private streamANYBuffer: allStreamBufferType
    private streamBTCBuffer: allStreamBufferType
    private streamETHBuffer: allStreamBufferType
    private streamXRPBuffer: allStreamBufferType


    constructor() {
        this.args = yargs(hideBin(process.argv)).argv;
        this.serviceApi = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC,XRP&tsyms=USD&api_key=' + key
        this.serviceApiBTCwithDate = 'https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=24&api_key=' + key + '&toTs='
        this.serviceApiETHwithDate = 'https://min-api.cryptocompare.com/data/v2/histohour?fsym=ETH&tsym=USD&limit=24&api_key=' + key + '&toTs='
        this.serviceApiXRPwithDate = 'https://min-api.cryptocompare.com/data/v2/histohour?fsym=XRP&tsym=USD&limit=24&api_key=' + key + '&toTs='

        this.serviceStreamCSVData = fs.createReadStream(file)
        this.timeStart = new Date().getTime();

        this.streamANYBuffer = {
            timestamp: '0',
            transaction_type: '',
            token: '',
            amount: '',
        } as allStreamBufferType
        this.streamBTCBuffer = {
            timestamp: '0',
            transaction_type: '',
            token: '',
            amount: '',
        } as allStreamBufferType
        this.streamETHBuffer = {
            timestamp: '0',
            transaction_type: '',
            token: '',
            amount: '',
        } as allStreamBufferType
        this.streamXRPBuffer = {
            timestamp: '0',
            transaction_type: '',
            token: '',
            amount: '',
        } as allStreamBufferType

    }

    async initCmnd() {
        this.logInfo()

        if (this.args.token && this.args.date) {
            let resultTokenandData: any = await this.getfromTokenDate()
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

        let resltLatest = await this.getLates()
        console.log(resltLatest)
        this.timeLapse()
        return

    }

    private async getLates() {
        let localBuffer: any = []
        return new Promise(async (resolve) => {
            let priceData = await this.fetchUsd()
            if (priceData.result) {
                this.serviceStreamCSVData.on('data', (data: any[]) => {

                    data.toString().split(/\n/).map((lines: any, i) => {
                        let line = lines.split(',');
                        if (line[2] === 'BTC' && Number(line[0]) > Number(this.streamBTCBuffer.timestamp)) {
                            this.streamBTCBuffer.timestamp = line[0]
                            this.streamBTCBuffer.transaction_type = line[1]
                            this.streamBTCBuffer.token = line[2]
                            this.streamBTCBuffer.amount = line[3]
                        }
                        if (line[2] === 'ETH' && Number(line[0]) > Number(this.streamETHBuffer.timestamp)) {
                            this.streamETHBuffer.timestamp = line[0]
                            this.streamETHBuffer.transaction_type = line[1]
                            this.streamETHBuffer.token = line[2]
                            this.streamETHBuffer.amount = line[3]
                        }
                        if (line[2] === 'XRP' && Number(line[0]) > Number(this.streamXRPBuffer.timestamp)) {
                            this.streamXRPBuffer.timestamp = line[0]
                            this.streamXRPBuffer.transaction_type = line[1]
                            this.streamXRPBuffer.token = line[2]
                            this.streamXRPBuffer.amount = line[3]
                        }
                    })

                })
                this.serviceStreamCSVData.on('close', async () => {

                    resolve([{
                        Token: 'BTC',
                        Value: this.streamBTCBuffer.amount,
                        USD: (Number(this.streamBTCBuffer.amount) * this.latestPriceTokenType(this.streamBTCBuffer.token, priceData.data)).toString()
                    }, {
                        Token: 'ETH',
                        Value: this.streamETHBuffer.amount,
                        USD: (Number(this.streamETHBuffer.amount) * this.latestPriceTokenType(this.streamETHBuffer.token, priceData.data)).toString()
                    }, {
                        Token: 'XRP',
                        Value: this.streamXRPBuffer.amount,
                        USD: (Number(this.streamXRPBuffer.amount) * this.latestPriceTokenType(this.streamXRPBuffer.token, priceData.data)).toString()
                    }])

                })
            } else {
                resolve(localBuffer)
            }
        })
    }

    private async getLatesfromToken() {
        let localBuffer: any = []
        return new Promise(async (resolve) => {
            let priceData = await this.fetchUsd()
            if (priceData.result) {
                this.serviceStreamCSVData.on('data', (data: any[]) => {
                    data.toString().split(/\n/).map((lines: any, i) => {
                        let line = lines.split(',');
                        if (line[2] === this.args.token && Number(line[0]) > Number(this.streamANYBuffer.timestamp)) {
                            this.streamANYBuffer.timestamp = line[0]
                            this.streamANYBuffer.transaction_type = line[1]
                            this.streamANYBuffer.token = line[2]
                            this.streamANYBuffer.amount = line[3]
                        }
                    })
                })
                this.serviceStreamCSVData.on('close', async () => {
                    resolve([{
                        Token: this.streamANYBuffer.token,
                        Value: this.streamANYBuffer.amount,
                        USD: (Number(this.streamANYBuffer.amount) * this.latestPriceTokenType(this.streamANYBuffer.token, priceData.data)).toString()
                    }])
                })
            } else {
                resolve(localBuffer)
            }
        })
    }

    private async getfromDate() {
        const dateObject = new Date(this.args.date);
        let thisTime = dateObject.getTime()
        let addonedayTime = thisTime - (3600 * 1000 * 24)
        let localBuffer: any = []

        return new Promise(async (resolve) => {
            let priceData = await this.fetchUsdwithDate()
            if (priceData.result) {
                this.serviceStreamCSVData.on('data', (data: any[]) => {
                    data.toString().split(/\n/).map((lines: any, i) => {
                        let line = lines.split(',');
                        if (Number(line[0]) <= (thisTime / 1000) && Number(line[0]) >= (addonedayTime / 1000)) {

                            if (line[2] === 'BTC') {
                                priceData.BTC.map((el: any) => {

                                    if (Number(line[0]) <= Number(el.time) && Number(line[0]) >= (Number(el.time) - 3600)) {

                                        const current = new Date(Number(line[0] * 1000)).toLocaleTimeString('default', {
                                            year: "2-digit",
                                            month: "2-digit",
                                            day: "2-digit"
                                        });
                                        let obj = {
                                            Token: line[2],
                                            Value: line[3],
                                            USD: (Number(line[3] * el.open)).toString(),
                                            Date: current,
                                        }
                                        localBuffer.push(obj)
                                    }
                                })
                            }
                            if (line[2] === 'ETH') {
                                priceData.ETH.map((el: any) => {
                                    if (Number(line[0]) <= Number(el.time) && Number(line[0]) >= (Number(el.time) - 3600)) {

                                        const current = new Date(Number(line[0] * 1000)).toLocaleTimeString('default', {
                                            year: "2-digit",
                                            month: "2-digit",
                                            day: "2-digit"
                                        });
                                        let obj = {
                                            Token: line[2],
                                            Value: line[3],
                                            USD: (Number(line[3] * el.open)).toString(),
                                            Date: current,
                                        }
                                        localBuffer.push(obj)
                                    }
                                })
                            }
                            if (line[2] === 'XRP') {
                                priceData.XRP.map((el: any) => {
                                    if (Number(line[0]) <= Number(el.time) && Number(line[0]) >= (Number(el.time) - 3600)) {

                                        const current = new Date(Number(line[0] * 1000)).toLocaleTimeString('default', {
                                            year: "2-digit",
                                            month: "2-digit",
                                            day: "2-digit"
                                        });
                                        let obj = {
                                            Token: line[2],
                                            Value: line[3],
                                            USD: (Number(line[3] * el.open)).toString(),
                                            Date: current,
                                        }
                                        localBuffer.push(obj)
                                    }
                                })
                            }
                        }
                    })
                })
                this.serviceStreamCSVData.on('close', async () => {
                    resolve(localBuffer)
                })
            } else {
                resolve(localBuffer)
            }
        })
    }

    private async getfromTokenDate() {
        const dateObject = new Date(this.args.date);
        let thisTime = dateObject.getTime()
        let addonedayTime = thisTime - (3600 * 1000 * 24)
        let localBuffer: any = []

        return new Promise(async (resolve) => {
            let priceData = await this.fetchUsdwithTokenDate()
            if (priceData.result) {
                this.serviceStreamCSVData.on('data', (data: any[]) => {
                    data.toString().split(/\n/).map((lines: any, i) => {
                        let line = lines.split(',');

                        if (line[2] === this.args.token && Number(line[0]) <= (thisTime / 1000) && Number(line[0]) >= (addonedayTime / 1000)) {

                            priceData.data.map((el: any) => {

                                if (Number(line[0]) <= Number(el.time) && Number(line[0]) >= (Number(el.time) - 3600)) {

                                    const current = new Date(Number(line[0] * 1000)).toLocaleTimeString('default', {
                                        year: "2-digit",
                                        month: "2-digit",
                                        day: "2-digit"
                                    });
                                    let obj = {
                                        Token: line[2],
                                        Value: line[3],
                                        USD: (Number(line[3] * el.open)).toString(),
                                        Date: current,
                                    }
                                    localBuffer.push(obj)
                                }
                            })
                        }
                    })
                })
                this.serviceStreamCSVData.on('close', async () => {
                    resolve(localBuffer)
                })
            } else {
                resolve(localBuffer)
            }
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

    private async fetchUsdwithDate() {
        try {
            const dateObject = new Date(this.args.date);
            let thisTime = dateObject.getTime()
            const responseBTC = await fetch(this.serviceApiBTCwithDate + Number(thisTime / 1000).toString())
            const jsonBTC = await responseBTC.json()
            const listBTCData = jsonBTC.Data.Data

            const responseETH = await fetch(this.serviceApiETHwithDate + Number(thisTime / 1000).toString())
            const jsonETH = await responseETH.json()
            const listETHData = jsonETH.Data.Data

            const responseXRP = await fetch(this.serviceApiXRPwithDate + Number(thisTime / 1000).toString())
            const jsonXRP = await responseXRP.json()
            const listXRPData = jsonXRP.Data.Data

            return {
                result: true,
                BTC: listBTCData,
                ETH: listETHData,
                XRP: listXRPData
            }


        } catch (error) {
            return {
                result: false,
                data: error
            }
        }
    }

    private async fetchUsdwithTokenDate() {
        try {
            const dateObject = new Date(this.args.date);
            let thisTime = dateObject.getTime()
            switch (this.args.token) {
                case 'BTC':
                    const responseBTC = await fetch(this.serviceApiBTCwithDate + Number(thisTime / 1000).toString())
                    const jsonBTC = await responseBTC.json()
                    const listBTCData = jsonBTC.Data.Data
                    return {
                        result: true,
                        data: listBTCData,
                    }
                case 'ETH':
                    const responseETH = await fetch(this.serviceApiETHwithDate + Number(thisTime / 1000).toString())
                    const jsonETH = await responseETH.json()
                    const listETHData = jsonETH.Data.Data

                    return {
                        result: true,
                        data: listETHData,
                    }
                case 'XRP':
                    const responseXRP = await fetch(this.serviceApiXRPwithDate + Number(thisTime / 1000).toString())
                    const jsonXRP = await responseXRP.json()
                    const listXRPData = jsonXRP.Data.Data
                    return {
                        result: true,
                        data: listXRPData,
                    }
                default:
                    return {
                        result: true,
                        data: [],
                    }
            }
        } catch (error) {
            return {
                result: false,
                data: error
            }
        }
    }

    private latestPriceTokenType(token: string, price: any) {
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
        console.log('it takes time between 20 second..')
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

