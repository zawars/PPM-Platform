/**
 * Sails Seed Settings
 * (sails.config.seeds)
 *
 * Configuration for the data seeding in Sails.
 *
 * For more information on configuration, check out:
 * http://github.com/frostme/sails-seed
 */
module.exports.seeds = {
  configurations: [{
    "uid": 1,
    "rates": {
      "GBP": 1.39,
      "USD": 1,
      "CHF": 1,
      "EUR": 1.15
    },
    "baseCurrency": "CHF"
  }],
  emailconfig: [{
      "text": "The following Project Approval request is waiting for your response. <br><br><br>  Please follow the link to reply: <a href='http://euk-84842.eukservers.com'>http://euk-84842.eukservers.com</a> <br><br><br><br> Thank You <br><br> MEGOWORK PPM <br><br> Note: This is an automatically generated message. Please do not reply to this message.",
      "event": "Project Outline Approval",
    },
    {
      "text": "Your Project has been approved.",
      "event": "Approval",
    },
    {
      "text": "Project Outline is on hold from the approver.",
      "event": "On Hold",
    },
    {
      "text": "Please note that your request has be returned back to you. Kindly contact the concerned person to clarify and resubmit. <br><br><br>  Please follow the link to reply: <a href='http://euk-84842.eukservers.com'>http://euk-84842.eukservers.com</a> <br><br><br><br> Thank You <br><br> MEGOWORK PPM <br><br> Note: This is an automatically generated message. Please do not reply to this message.",
      "event": "Return to Sender",
    },
    {
      "text": "Project Outline has been rejected by approver.",
      "event": "Rejected",
    },
    {
      "text": "Project Change Request is on hold from the approver.",
      "event": "Project Change Request On Hold",
    },
    {
      "text": "Project Change Request has been rejected by approver.",
      "event": "Project Change Request Rejected",
    },
    {
      "text": "Project Closing Report is on hold from the approver..",
      "event": "Project Closing Report On Hold",
    },
    {
      "text": "Project Closing Report has been rejected by approver.",
      "event": "Project Closing Report Rejected",
    }
  ],
  dropdown: [{
      "values": [{
          "name": "Project",
        },
        {
          "name": "Time",
        },
        {
          "name": "Scope",
        },
        {
          "name": "Technical",
        },
        {
          "name": "Resources",
        },
        {
          "name": "Vendor",
        }
      ],
      "field": "Lesson Category",
    },
    {
      "values": [{
          "name": "Business Case",
        },
        {
          "name": "Project Plan",
        },
        {
          "name": "Time Sheet",
        },
        {
          "name": "Contracts",
        },
        {
          "name": "Others",
        }
      ],
      "field": "Document Type",
    },
    {
      "values": [{
          "name": "Energy",
        },
        {
          "name": "Grids (Netze)",
        },
        {
          "name": "Services",
        },
        {
          "name": "Others",
        }
      ],
      "field": "Business Area",
    },
    {
      "values": [{
          "name": "BKW AG",
        },
        {
          "name": "Arnold AG",
        },
        {
          "name": "ISP AG",
        },
        {
          "name": "AEK AG",
        }
      ],
      "field": "Company Name",
    },
    {
      "values": [{
          "name": "P",
        },
        {
          "name": "N",
        },
        {
          "name": "E",
        },
        {
          "name": "M",
        },
        {
          "name": "KS",
        },
        {
          "name": "FD",
        }
      ],
      "field": "Business Unit",
    },
    {
      "values": [{
          "name": "Plant / Solution Project",
        },
        {
          "name": "Infrastructure",
        },
        {
          "name": "Development Project",
        },
        {
          "name": "M&A- /Divestment Project",
        },
        {
          "name": "Optimization Project",
        },
        {
          "name": "IT Project",
        },
        {
          "name": "Post-Merger Project",
        }
      ],
      "field": "Project Type",
    },
    {
      "values": [{
          "name": "KL",
        },
        {
          "name": "GB",
        },
        {
          "name": "GE",
        }
      ],
      "field": "Rerporting Level",
    },
    {
      "values": [{
          "name": "A",
        },
        {
          "name": "B",
        },
        {
          "name": "C",
        }
      ],
      "field": "Classification",
    },
    {
      "values": [{
          "name": "Low",
        },
        {
          "name": "Medium",
        },
        {
          "name": "High",
        }
      ],
      "field": "Strategic Contribution",
    },
    {
      "values": [{
          "name": "Low",
        },
        {
          "name": "Medium",
        },
        {
          "name": "High",
        }
      ],
      "field": "Feasibility",
    },
    {
      "values": [{
          "name": "Low",
        },
        {
          "name": "Medium",
        },
        {
          "name": "High",
        }
      ],
      "field": "Profitability",
    },
    {
      "values": [{
          "name": "Agile",
        },
        {
          "name": "Prince 2",
        },
        {
          "name": "SIA",
        },
        {
          "name": "PMI",
        }
      ],
      "field": "Project Methodology",
    },
    {
      "values": [{
          "name": "Initiating",
        },
        {
          "name": "Planning",
        },
        {
          "name": "Executing",
        },
        {
          "name": "Closing",
        }
      ],
      "field": "Project Phase",
    },
    {
      "values": [{
          "name": "Compliance",
        },
        {
          "name": "Financial",
        },
        {
          "name": "Reputation",
        },
        {
          "name": "Security",
        },
        {
          "name": "Operational",
        }
      ],
      "field": "Risk Category",
    },
    {
      "values": [{
          "name": "Phase / Gate",
        },
        {
          "name": "Budget Increase",
        },
        {
          "name": "Project Steering",
        },
        {
          "name": "IT-Architectur",
        },
        {
          "name": "IT-Security",
        },
        {
          "name": "Compliance",
        },
        {
          "name": "Other",
        }
      ],
      "field": "Decision Type",
    },
    {
      "values": [{
          "name": "Avoid",
        },
        {
          "name": "Reduce",
        },
        {
          "name": "Shift",
        },
        {
          "name": "Accept",
        }
      ],
      "field": "Risk Strategy",
    }
  ]
}
