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
      "field": "Reporting Level",
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
    },
    {
      "values": [{
          "name": "P am Markt",
        },
        {
          "name": "P KWK",
        },
        {
          "name": "P Wind",
        },
        {
          "name": "Wärme & Contracting",
        },
        {
          "name": "Handel",
        },
        {
          "name": "Verkauf CH",
        },
        {
          "name": "Netze",
        },
        {
          "name": "Infra-Engineering",
        },
        {
          "name": "Netz-DL",
        },
        {
          "name": "Wind & Solar DL",
        },
        {
          "name": "Gebäudetechnik",
        },
        {
          "name": "Energiebezogene DL",
        },
        {
          "name": "Steuerung & Support",
        },
        {
          "name": "F&E",
        }
      ],
      "field": "Business Segment",
    },
    {
      "values": [{
          "name": "Yes",
        },
        {
          "name": "No",
        }
      ],
      "field": "Mandatory Projects",
    },
    {
      "values": [{
          "name": "On"
        },
        {
          "name": "From"
        }
      ],
      "field": "Impact"
    }
  ],
  helpguide: [{
      name: 'Project Outline',
      fields: [{
          name: 'Project Name',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Purpose',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Project Manager',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Estimated Project Duration',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Current Situation',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Goals',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Deliverables',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Out Of Scope',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Risks',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Currency',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Qualitative Benefits',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Quantitative Benefits',
          value: '',
          type: ''
        },
        {
          name: 'Estimated Project Cost',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Involved Partners',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Mandatory Project',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Business Unit',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Business Area',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Business Segment',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Reporting Level',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Classification',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Project Type',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Part of a Program',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Strategic Contribution',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Feasibility',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Profitability',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Start of creation of Project Order',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'End of creation of project order',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Funds Required for Initiation',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Additional Information',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'PMO',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Project Sponsor',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Attachments',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
      ]
    },
    {
      name: 'Project Order',
      fields: [{
          name: 'Project Name',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Purpose',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Project Manager',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Estimated Project Duration',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Current Situation',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Goals',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Deliverables',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Out Of Scope',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Communication',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Currency',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Qualitative Benefits',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Quantitative Benefits',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Budgeted',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Project Costs',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Involved Partners',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Risks',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Dependencies',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Mandatory Project',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Business Unit',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Business Area',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Business Segment',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Reporting Level',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Classification',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Project Type',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Part of a Program',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Strategic Contribution',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Feasibility',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Profitability',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Additional Information',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Attachments',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'PMO',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Project Sponsor',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'FICO',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Project Organisation',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Tripple Constraint',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Order Questions',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Milestones',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        }
      ]
    },
    {
      name: 'Change Request',
      fields: [{
          name: 'Goals',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Deliverables',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Out Of Scope',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Currency',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Quantitative Benefits',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Qualitative Benefits',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Consequences of non-implementation',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Possible Alternatives',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Mandatory Project',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Business Unit',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Business Area',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Business Segment',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Reporting Level',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Classification',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Project Type',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Part of a Program',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Strategic Contribution',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Feasibility',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Profitability',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Project Name',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Project Manager',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Reason for Change Request',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Actual Project Budget',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Effects on Project Budget',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Effects on Time',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Consequences of non-implementation',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'ChangeRequest Questions',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'PMO',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Project Sponsor',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Tripple Constraint',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        }
      ]
    },
    {
      name: 'Closing Report',
      fields: [{
          name: 'Goals',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Deliverables',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Quantitative Benefits',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Qualitative Benefits',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Project Name',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Project Manager',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Reason For Deviation Goals And Deliverables',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Reason For Deviation Qualitative and Quantitative Benefits',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Cost Deviations',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Time Deviation',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Reason For Deviation Cost and Time',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Lessons Learned',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Pending',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'ClosingReport Questions',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'PMO',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Project Sponsor',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'FICO',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        }
      ]
    }
  ],
  questions: [{
      name: 'Project Outline',
      questions: [{
          question: 'Does your project involve any BKW employee, corporate or customer data?',
          department: 'Compliance'
        },
        {
          question: 'Has the financing of your project been clarified with your department controller?',
          department: 'Controlling'
        },
        {
          question: 'Does your project have an impact on BKW external customer?',
          department: 'Customer Experience'
        },
        {
          question: 'Does your project have any impact on BKW organisation?',
          department: 'Human Resources'
        },
        {
          question: 'Does your project involve (external or internal) ICT services, solutions or interfaces?',
          department: 'ICT'
        },
        {
          question: 'Will any material, software application or services will be procured from external sources?',
          department: 'Procurement'
        }
      ]
    },
    {
      name: 'Project Order',
      questions: [{
          question: 'Does your project involve any BKW employee, corporate or customer data?',
          department: 'Compliance'
        },
        {
          question: 'Has the financing of your project been clarified with your department controller?',
          department: 'Controlling'
        },
        {
          question: 'Does your project have an impact on BKW external customer?',
          department: 'Customer Experience'
        },
        {
          question: 'Does your project have any impact on BKW organisation?',
          department: 'Human Resources'
        },
        {
          question: 'Does your project involve (external or internal) ICT services, solutions or interfaces?',
          department: 'ICT'
        },
        {
          question: 'Will any material, software application or services will be procured from external sources?',
          department: 'Procurement'
        }
      ]
    },
    {
      name: 'Change Request',
      questions: [{
          question: 'Does your project involve any BKW employee, corporate or customer data?',
          department: 'Compliance'
        },
        {
          question: 'Has the financing of your project been clarified with your department controller?',
          department: 'Controlling'
        },
        {
          question: 'Does your project have an impact on BKW external customer?',
          department: 'Customer Experience'
        },
        {
          question: 'Does your project have any impact on BKW organisation?',
          department: 'Human Resources'
        },
        {
          question: 'Does your project involve (external or internal) ICT services, solutions or interfaces?',
          department: 'ICT'
        },
        {
          question: 'Will any material, software application or services will be procured from external sources?',
          department: 'Procurement'
        }
      ]
    },
    {
      name: 'Closing Report',
      questions: [{
          question: 'Does your project involve any BKW employee, corporate or customer data?',
          department: 'Compliance'
        },
        {
          question: 'Has the financing of your project been clarified with your department controller?',
          department: 'Controlling'
        },
        {
          question: 'Does your project have an impact on BKW external customer?',
          department: 'Customer Experience'
        },
        {
          question: 'Does your project have any impact on BKW organisation?',
          department: 'Human Resources'
        },
        {
          question: 'Does your project involve (external or internal) ICT services, solutions or interfaces?',
          department: 'ICT'
        },
        {
          question: 'Will any material, software application or services will be procured from external sources?',
          department: 'Procurement'
        }
      ]
    }
  ],
}
