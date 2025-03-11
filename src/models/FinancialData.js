const mongoose = require("mongoose");

const financialSchema = new mongoose.Schema(
  {
    company_id: { 
        type: String, 
        required: true,
        index: true
    },
    company_name: { 
        type: String, 
        required: true 
    },
    reporting_period: { 
        type: String, 
        required: true,
        index: true

    },
    industry_sector: { 
        type: String, 
        required: true,
        index: true

    },
    total_assets: { 
        type: Number, 
        required: true 
    },
    total_liabilities: { 
        type: Number, 
        required: true 

    },
    revenue: { 
        type: Number, 
        required: true 

    },
    net_profit: { 
        type: Number, 
        required: true 

    },
    debt_to_equity_ratio: { 
        type: Number, 
        default:null 
    },
    cash_flow: { 
        type: Number, 
        required: true 

    },
    operating_margin: { 
        type: Number, 
        default:null

    },
    return_on_equity: { 
        type: Number, 
        default:null

    },
    interest_coverage_ratio: { 
        type: Number, 
        required : true 

    },
    z_score: { 
        type: Number,
        default:null

    },
    risk_score: { 
        type: Number,
        default:null


    },
  },
  { timestamps: true }
);
financialSchema.index({ company_id: 1, reporting_period: 1,industry_sector: 1 }, { unique: true });

module.exports = mongoose.model("FinancialData", financialSchema);
