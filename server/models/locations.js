var mongoose = require('mongoose');

var locationsSchema = mongoose.Schema({
    src_locationAddress: String,
    src_locationName: String,
    src_customerId: String,
    src_compKeySrcCustId: String,
    src: String,
    g_location: {
        lat: String,
        lng: String
    },
    g_candidates: [
        {
            "place_id": String
        }
    ],
    g_locationName: String,
    g_address: String,
    g_place_id: String,
    g_website: String,
    g_url: String,
    g_phone: String,
    g_hours: [String],
    dirty: Boolean,
    lastCleaned: Date
});

var Location = mongoose.model('Location',locationsSchema);

module.exports = Location;