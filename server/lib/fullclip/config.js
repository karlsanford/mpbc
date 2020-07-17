var path = require('path');
var rootPath = path.normalize(__dirname + '/../../../');

module.exports = {
    dataMap: {
        'Company': 'src_locationName',
        'Address, City, State & Zip': 'src_locationAddress',
        'Product Name': 'src_productName',
        'Date': 'src_date',
        'Customer Num': 'src_customerId',
        'Product Num': 'src_productId',
        'Sale': 'src_qty',
        'Salesman Assigned': 'src_salesPerson',
        'Phone': 'src_phone',
        'Supplier Product ID': 'src_supplierProductId',
        'Product Type': 'src_productType'
    },
    valueMaps: {
        products: {
            names: {
                "Half Life - 4/6/12 CN": "Half Life - cases of cans",
                "Hoppenheimer - 4/6/12 CN": "Hoppenheimer - cases of cans",
                "Manhattan Project Tulip Glassware": "Manhattan Project Tulip Glassware",
                "Plutonium-239 - 4/6/12 CN": "Plutonium-239 - cases of cans",
                "Black Matter - 6/4/12 CN": "Black Matter - cases of cans",
                "Necessary Evil - 4/6/12 CN": "Necessary Evil - cases of cans",
                "Half Life - 1/6 BBL": "Half Life - draft",
                "Half Life - 1/2 BBL": "Half Life - draft",
                "Double Half Life - 1/6 _BBL": "Double Half Life - draft",
                "Atomic Alliance - 1/6 BBL": "Atomic Alliance - draft",
                "Plutonium-239 - 1/6 BBL": "Plutonium-239 - draft",
                "Hoppenheimer - 1/6 BBL": "Hoppenheimer - draft",
                "Hoppenheimer - 1/2 BBL": "Hoppenheimer - draft",
                "Double Half Life - 1/2 BBL": "Double Half Life - draft",
                "Wise Monkey - 1/6 BBL": "Wise Monkey - draft",
                "Necessary Evil - 1/2 BBL": "Necessary Evil - draft",
                "Necessary Evil - 1/6 BBL": "Necessary Evil - draft",
                "Blackberry Fission - 1/6 BBL": "Blackberry Fission - draft",
                "Black Matter - 1/6 BBL": "Black Matter - draft",
                "Plutonium-239 - 1/2 BBL": "Plutonium-239 - draft",
                "Black Matter - 1/2 BBL": "Black Matter - draft",
                "10 Nanoseconds - 1/6 BBL": "10 Nanoseconds - draft",
                "Trinitite Brut IPA- 1/6 BBL": "Trinitite Sparkling IPA- draft",
                "Wise Monkey - 1/2 BBL": "Wise Monkey - draft",
                "Inception - 1/6 BBL": "Inception - draft",
                "Blackberry Fission - 1/2 BBL": "Blackberry Fission - draft"
            }
        }
    },
    urls: {
        login: "https://fullclipcraft.net",
        reports: {
            sales: "https://fullclipcraft.net/ECP_18.06_B/aspx1/ReportView.aspx?Format=WebQuery&ParseFromReportURL=True&ReportID=3123102&ReportName=Sales+last+4+weeks+(2)&",
            products: "https://fullclipcraft.net/ECP_18.06_B/aspx1/ReportView.aspx?ParseFromReportURL=True&ReportID=3122005&ReportName=Products&LinkFavoritesID=64&IsFavorite=1",
            locations: "https://fullclipcraft.net/ECP_18.06_B/aspx1/ReportView.aspx?Format=WebQuery&ParseFromReportURL=True&ReportID=3123104&ReportName=Customers+(Locations)&"
        }
    },
    reportList: ['sales', 'products', 'locations'],
    creds: {
        //TODO implement as env var
        username: "MHProject",
        password: "Plutonium239"
    },
    identifiers: {
        un_id: "#ews-login-username",
        pw_id: "#ews-login-password",
        submit_id: "#ActionButtonSignIn"
    },
    src: 'fullclip'
}
