exports.emailStatusPriority = {
  pending: () => 0,

  // Delivery events
  processed: () => 1,
  dropped: () => 2,
  deferred: () => 2,
  bounce: () => 3,
  delivered: () => 3,

  // Engagement events
  open: () => 4,
  spamreport: () => 4,
  unsubscribe: () => 4,
  group_unsubscribe: () => 4,
  group_resubscribe: () => 4,
  click: () => 5,

  default: () => 0,
};
