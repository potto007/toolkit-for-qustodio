module.exports = [
  {
    name: 'DaysOfBuffering',
    type: 'checkbox',
    default: false,
    section: 'budget',
    title: 'Days of Buffering Metric',
    description:
      "This calculation shows how long your money would likely last if you never earned another cent based on your average spending. We know that no month is 'average' but this should give you some idea of how much of a buffer you have. Equal to budget accounts total divided by the average daily outflow. That comes from sum of all outflow transactions from on budget accounts only divided by the age of budget in days. You can also change the number of days taken into account by this metric with the 'Days of Buffering History Lookup' setting.",
  },
  {
    name: 'DaysOfBufferingHistoryLookup',
    type: 'select',
    default: '0',
    section: 'budget',
    title: 'Days of Buffering History Lookup',
    description: 'How old transactions should be used for average daily outflow calculation.',
    options: [
      { name: 'All', value: '0' },
      { name: '1 year', value: '12' },
      { name: '6 months', value: '6' },
      { name: '3 months', value: '3' },
      { name: '1 month', value: '1' },
    ],
  },
];
