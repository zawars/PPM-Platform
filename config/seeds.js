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
      event: "Outline Approval Confirmation",
      text: ""
    },
    {
      event: "Order Approval Confirmation",
      text: ""
    },
    {
      event: "Change Request Approval Confirmation",
      text: ""
    },
    {
      event: "Closing Report Approval Confirmation",
      text: ""
    },
    {
      event: "Outline On Hold",
      text: ""
    },
    {
      event: "Order On Hold",
      text: ""
    },
    {
      event: "Change Request On Hold",
      text: ""
    },
    {
      event: "Closing Report On Hold",
      text: ""
    },
    {
      event: "Outline Returned",
      text: ""
    },
    {
      event: "Order Returned",
      text: ""
    },
    {
      event: "Change Request Returned",
      text: ""
    },
    {
      event: "Closing Report Returned",
      text: ""
    },
    {
      event: "Outline Rejected",
      text: ""
    },
    {
      event: "Order Rejected",
      text: ""
    },
    {
      event: "Change Request Rejected",
      text: ""
    },
    {
      event: "Closing Report Rejected",
      text: ""
    },
    {
      event: "Closing Report Rejected",
      text: ""
    },
    {
      event: "Email Reminder Project Order",
      text: ""
    },
    {
      event: "Email Reminder Pending Approval",
      text: ""
    },
    {
      event: "Email Reminder Status Report",
      text: ""
    },
    {
      event: "Email Reminder Closing Report",
      text: ""
    }
  ],
  dropdown: [{
      "values": [{
          "name": "Project",
          position: 0
        },
        {
          "name": "Time",
          position: 1
        },
        {
          "name": "Scope",
          position: 2
        },
        {
          "name": "Technical",
          position: 3
        },
        {
          "name": "Resources",
          position: 4
        },
        {
          "name": "Vendor",
          position: 5
        }
      ],
      "field": "Lesson Category",
    },
    {
      "values": [{
          "name": "Business Case",
          position: 0
        },
        {
          "name": "Project Plan",
          position: 1
        },
        {
          "name": "Time Sheet",
          position: 2
        },
        {
          "name": "Contracts",
          position: 3
        },
        {
          "name": "Others",
          position: 4
        }
      ],
      "field": "Document Type",
    },
    {
      "values": [{
          "name": "Energy",
          position: 0
        },
        {
          "name": "Grids (Netze)",
          position: 1
        },
        {
          "name": "Services",
          position: 2
        },
        {
          "name": "Others",
          position: 3
        }
      ],
      "field": "Business Area",
    },
    {
      "values": [{
          "name": "BKW AG",
          position: 0
        },
        {
          "name": "Arnold AG",
          position: 1
        },
        {
          "name": "ISP AG",
          position: 2
        },
        {
          "name": "AEK AG",
          position: 3
        }
      ],
      "field": "Company Name",
    },
    {
      "values": [{
          "name": "P",
          position: 0
        },
        {
          "name": "N",
          position: 1
        },
        {
          "name": "E",
          position: 2
        },
        {
          "name": "M",
          position: 3
        },
        {
          "name": "KS",
          position: 4
        },
        {
          "name": "FD",
          position: 5
        }
      ],
      "field": "Business Unit",
    },
    {
      "values": [{
          "name": "Plant / Solution Project",
          position: 0
        },
        {
          "name": "Infrastructure",
          position: 1
        },
        {
          "name": "Development Project",
          position: 2
        },
        {
          "name": "M&A- /Divestment Project",
          position: 3
        },
        {
          "name": "Optimization Project",
          position: 4
        },
        {
          "name": "IT Project",
          position: 5
        },
        {
          "name": "Post-Merger Project",
          position: 6
        }
      ],
      "field": "Project Type",
    },
    {
      "values": [{
          "name": "KL",
          position: 0
        },
        {
          "name": "GB",
          position: 1
        },
        {
          "name": "GE",
          position: 2
        }
      ],
      "field": "Reporting Level",
    },
    {
      "values": [{
          "name": "A",
          position: 0
        },
        {
          "name": "B",
          position: 1
        },
        {
          "name": "C",
          position: 2
        }
      ],
      "field": "Classification",
    },
    {
      "values": [{
          "name": "Low",
          position: 0
        },
        {
          "name": "Medium",
          position: 1
        },
        {
          "name": "High",
          position: 2
        }
      ],
      "field": "Strategic Contribution",
    },
    {
      "values": [{
          "name": "Low",
          position: 0
        },
        {
          "name": "Medium",
          position: 1
        },
        {
          "name": "High",
          position: 2
        }
      ],
      "field": "Feasibility",
    },
    {
      "values": [{
          "name": "Low",
          position: 0
        },
        {
          "name": "Medium",
          position: 1
        },
        {
          "name": "High",
          position: 2
        }
      ],
      "field": "Profitability",
    },
    {
      "values": [{
          "name": "Agile",
          position: 0
        },
        {
          "name": "Prince 2",
          position: 1
        },
        {
          "name": "SIA",
          position: 2
        },
        {
          "name": "PMI",
          position: 3
        }
      ],
      "field": "Project Methodology",
    },
    {
      "values": [{
          "name": "Initiating",
          position: 0
        },
        {
          "name": "Executing",
          position: 1
        },
        {
          "name": "Closing",
          position: 2
        }
      ],
      "field": "Project Phase",
    },
    {
      "values": [{
          "name": "Compliance",
          position: 0
        },
        {
          "name": "Financial",
          position: 1
        },
        {
          "name": "Reputation",
          position: 2
        },
        {
          "name": "Security",
          position: 3
        },
        {
          "name": "Operational",
          position: 4
        }
      ],
      "field": "Risk Category",
    },
    {
      "values": [{
          "name": "Phase / Gate",
          position: 0
        },
        {
          "name": "Budget Increase",
          position: 1
        },
        {
          "name": "Project Steering",
          position: 2
        },
        {
          "name": "IT-Architectur",
          position: 3
        },
        {
          "name": "IT-Security",
          position: 4
        },
        {
          "name": "Compliance",
          position: 5
        },
        {
          "name": "Other",
          position: 6
        }
      ],
      "field": "Decision Type",
    },
    {
      "values": [{
          "name": "Avoid",
          position: 0
        },
        {
          "name": "Reduce",
          position: 1
        },
        {
          "name": "Shift",
          position: 2
        },
        {
          "name": "Accept",
          position: 3
        }
      ],
      "field": "Risk Strategy",
    },
    {
      "values": [{
          "name": "P am Markt",
          position: 0
        },
        {
          "name": "P KWK",
          position: 1
        },
        {
          "name": "P Wind",
          position: 2
        },
        {
          "name": "Wärme & Contracting",
          position: 3
        },
        {
          "name": "Handel",
          position: 4
        },
        {
          "name": "Verkauf CH",
          position: 5
        },
        {
          "name": "Netze",
          position: 6
        },
        {
          "name": "Infra-Engineering",
          position: 7
        },
        {
          "name": "Netz-DL",
          position: 8
        },
        {
          "name": "Wind & Solar DL",
          position: 9
        },
        {
          "name": "Gebäudetechnik",
          position: 10
        },
        {
          "name": "Energiebezogene DL",
          position: 11
        },
        {
          "name": "Steuerung & Support",
          position: 12
        },
        {
          "name": "F&E",
          position: 13
        }
      ],
      "field": "Business Segment",
    },
    {
      "values": [{
          "name": "Yes",
          position: 0
        },
        {
          "name": "No",
          position: 1
        }
      ],
      "field": "Mandatory Projects",
    },
    {
      "values": [{
          "name": "Yes",
          position: 0
        },
        {
          "name": "No",
          position: 1
        }
      ],
      "field": "IT Relevant",
    },
    {
      "values": [{
          "name": "On",
          position: 0
        },
        {
          "name": "From",
          position: 1
        }
      ],
      "field": "Impact",
    },
    {
      "values": [{
          "name": "Predictive Maintenance",
          position: 0
        },
        {
          "name": "Pooling",
          position: 1
        },
        {
          "name": "Decentralized energy networks",
          position: 2
        },
        {
          "name": "Micro Grid",
          position: 3
        },
        {
          "name": "Areal Grids",
          position: 4
        },
        {
          "name": "Smart-Grid",
          position: 5
        },
        {
          "name": "Smart Living",
          position: 6
        },
        {
          "name": "Smart Regions",
          position: 7
        },
        {
          "name": "Internal consumption communities",
          position: 8
        },
        {
          "name": "Electric Car, e- Gas Station",
          position: 9
        },
        {
          "name": "Digital customer interface",
          position: 10
        },
      ],
      "field": "Digitalization Topic",
    },
    {
      "values": [{
          "name": "Data Analytics",
          position: 0
        },
        {
          "name": "Machine Learning, AI",
          position: 1
        },
        {
          "name": "Image recognition",
          position: 2
        },
        {
          "name": "IoT",
          position: 3
        },
        {
          "name": "Bots",
          position: 4
        },
        {
          "name": "BIM",
          position: 5
        },
        {
          "name": "Low Range Communication",
          position: 6
        }
      ],
      "field": "Technology",
    },
    {
      "values": [{
          "name": "Strengthen platform",
          position: 0
        },
        {
          "name": "New business area",
          position: 1
        },
        {
          "name": "Customer interface",
          position: 2
        }
      ],
      "field": "Digitalization Focus",
    },
    {
      "values": [{
          "name": "Partial digitization",
          position: 0
        },
        {
          "name": "Complete digitization",
          position: 1
        }
      ],
      "field": "IT Platform",
    },
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
        {
          name: 'Outline Questions',
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
        },
        {
          name: 'Possible Alternatives',
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
        },
        {
          name: 'Additional Information',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        }
      ]
    },
    {
      name: 'Project Status Report',
      fields: [{
          name: 'Reporting Period',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Percentage Complete',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Overall Status',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Management Summary',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Scope Status',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Scope Status Comments',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Cost Status',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Cost Status Comments',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Financials',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Current Reserves',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Obligation',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Time Status',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Time Status Comments',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Start Date',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Original End Date',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Planned End Date',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Forecast End Date',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Risk Status',
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
          name: 'Milestones',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Measures',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Decisions',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'PMO Comments',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
      ]
    },
    {
      name: 'Program Status Report',
      fields: [{
          name: 'Reporting Period',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Percentage Complete',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Overall Status',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Overall Status Comments',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Scope Status',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Scope Status Comments',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Cost Status',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Cost Status Comments',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Time Status',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Time Status Comments',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Risk Status',
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
          name: 'Milestones',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Measures',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
        {
          name: 'Decisions',
          value: '',
          type: '',
          attachmentId: '',
          originalName: ''
        },
      ]
    }
  ],
  questions: [{
      name: 'Project Outline',
      questions: [{
          question: 'Does your project involve any BKW employee, corporate or customer data?',
          department: 'Compliance',
          email: 'sample@gmail.com',
          group: 'Compliance',
          count: 1
        },
        {
          question: 'Has the financing of your project been clarified with your department controller?',
          department: 'Controlling',
          email: 'sample@gmail.com',
          group: 'Controlling',
          count: 1
        },
        {
          question: 'Does your project have any impact on BKW organisation?',
          department: 'Human Resources',
          email: 'sample@gmail.com',
          group: 'Human Resources',
          count: 1
        },
        {
          question: 'Does your project involve (external or internal) ICT services, solutions or interfaces1?',
          department: 'ICT',
          email: 'sample@gmail.com',
          group: 'ICT',
          count: 1
        },
        {
          question: 'Does your project involve (external or internal) ICT services, solutions or interfaces2?',
          department: 'ICT',
          email: '',
          group: 'ICT',
          count: 2
        },
        {
          question: 'Will any material, software application or services will be procured from external sources1?',
          department: 'Procurement',
          email: 'sample@gmail.com',
          group: 'Procurement',
          count: 1
        },
        {
          question: 'Will any material, software application or services will be procured from external sources2?',
          department: 'Procurement',
          email: '',
          group: 'Procurement',
          count: 2
        }
      ]
    },
    {
      name: 'Project Order',
      questions: [{
          question: 'Does your project involve any BKW employee, corporate or customer data?',
          department: 'Compliance',
          email: 'sample@gmail.com',
          group: 'Compliance',
          count: 1
        },
        {
          question: 'Has the financing of your project been clarified with your department controller1?',
          department: 'Controlling',
          email: 'sample@gmail.com',
          group: 'Controlling',
          count: 1
        },
        {
          question: 'Has the financing of your project been clarified with your department controller2?',
          department: 'Controlling',
          email: 'sample@gmail.com',
          group: 'Controlling',
          count: 2
        },
        {
          question: 'Has the financing of your project been clarified with your department controller3?',
          department: 'Controlling',
          email: '',
          group: 'Controlling',
          count: 3
        },
        {
          question: 'Does your project have any impact on BKW organisation?',
          department: 'Human Resources',
          email: 'sample@gmail.com',
          group: 'Human Resources',
          count: 1
        },
        {
          question: 'Does your project involve (external or internal) ICT services, solutions or interfaces1?',
          department: 'ICT',
          email: 'sample@gmail.com',
          group: 'ICT',
          count: 1
        },
        {
          question: 'Does your project involve (external or internal) ICT services, solutions or interfaces2?',
          department: 'ICT',
          email: '',
          group: 'ICT',
          count: 2
        },
        {
          question: 'Does your project involve (external or internal) ICT services, solutions or interfaces3?',
          department: 'ICT',
          email: '',
          group: 'ICT',
          count: 3
        },
        {
          question: 'Will any material, software application or services will be procured from external sources?',
          department: 'Procurement',
          email: 'sample@gmail.com',
          group: 'Procurement',
          count: 1
        }
      ]
    },
    {
      name: 'Change Request',
      questions: [{
          question: 'Does your project involve any BKW employee, corporate or customer data?',
          department: 'Compliance',
          email: 'sample@gmail.com',
          group: 'Compliance',
          count: 1
        },
        {
          question: 'Has the financing of your project been clarified with your department controller?',
          department: 'Controlling',
          email: 'sample@gmail.com',
          group: 'Controlling',
          count: 1
        },
        {
          question: 'Does your project involve (external or internal) ICT services, solutions or interfaces1?',
          department: 'ICT',
          email: 'sample@gmail.com',
          group: 'ICT',
          count: 1
        },
        {
          question: 'Does your project involve (external or internal) ICT services, solutions or interfaces2?',
          department: 'ICT',
          email: '',
          group: 'ICT',
          count: 2
        },
        {
          question: 'Does your project involve (external or internal) ICT services, solutions or interfaces3?',
          department: 'ICT',
          email: '',
          group: 'ICT',
          count: 3
        },
        {
          question: 'Will any material, software application or services will be procured from external sources?',
          department: 'Procurement',
          email: 'sample@gmail.com',
          group: 'Procurement',
          count: 1
        }
      ]
    },
    {
      name: 'Closing Report',
      questions: [{
          question: 'Does your project involve any BKW employee, corporate or customer data?',
          department: 'Compliance',
          email: 'sample@gmail.com',
          group: 'Compliance',
          count: 1
        },
        {
          question: 'Has the financing of your project been clarified with your department controller?',
          department: 'Controlling',
          email: 'sample@gmail.com',
          group: 'Controlling',
          count: 1
        },
        {
          question: 'Does your project involve (external or internal) ICT services, solutions or interfaces1?',
          department: 'ICT',
          email: 'sample@gmail.com',
          group: 'ICT',
          count: 1
        },
        {
          question: 'Does your project involve (external or internal) ICT services, solutions or interfaces2?',
          department: 'ICT',
          email: '',
          group: 'ICT',
          count: 2
        },
        {
          question: 'Will any material, software application or services will be procured from external sources1?',
          department: 'Procurement',
          email: 'sample@gmail.com',
          group: 'Procurement',
          count: 1
        },
        {
          question: 'Will any material, software application or services will be procured from external sources2?',
          department: 'Procurement',
          email: '',
          group: 'Procurement',
          count: 2
        }
      ]
    }
  ],
  program: [{
    programName: 'None',
    status: 'Active'
  }]
}
