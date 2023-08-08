const mongoose=require("mongoose");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    utility: {
        type: [String],
        enum: ['Monitoring or Inspection', 'Security', 'Delivery', 'Photography', 'Recreation']
    },
    weight: {
        type: String,
        lowercase: true
    },
    onSale: {
        type: Boolean,
        default: false
    }
},
{
  timestamps: true,
  versionKey: false,
  id: true,
  toJSON: {
    transform(doc, ret){
      ret.productId = ret._id
      delete ret._id
    }
  }
}
);
module.exports = mongoose.model('Product',productSchema);

