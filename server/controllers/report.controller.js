import Invoice from "../models/invoice.model.js";
import Task from "../models/Tasks.model.js";

export const getFinancialSummary = async (req, res) => {
  try {
    // Parse startDate and endDate from query params or default to last 30 days
    const now = new Date();
    let start = req.query.startDate ? new Date(req.query.startDate) : new Date(now);
    if (!req.query.startDate) start.setDate(now.getDate() - 30);
    
    let end = req.query.endDate ? new Date(req.query.endDate) : now;
    end.setHours(23, 59, 59, 999); // Include full end day

    // Total revenue from Paid invoices in date range
    const paidInvoices = await Invoice.aggregate([
      {
        $match: {
          status: "Paid",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    // Total outstanding amount (Pending or Unpaid) in date range
    const unpaidInvoices = await Invoice.aggregate([
      {
        $match: {
          status: { $in: ["Pending", "Unpaid"] },
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          outstandingAmount: { $sum: "$amount" },
        },
      },
    ]);

    // Task counts by status (optional: add date filter if needed)
    const [todoCount, inProgressCount, doneCount] = await Promise.all([
      Task.countDocuments({ column: "todo" }),
      Task.countDocuments({ column: "in-progress" }),
      Task.countDocuments({ column: "done" }),
    ]);

    // Daily revenue grouped by date string for the chart
    const dailyRevenueAgg = await Invoice.aggregate([
      {
        $match: {
          status: "Paid",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyRevenue = dailyRevenueAgg.map(({ _id, amount }) => ({
      date: _id,
      amount,
    }));

    res.status(200).json({
      totalRevenue: paidInvoices[0]?.totalRevenue || 0,
      unpaidInvoices: unpaidInvoices[0]?.outstandingAmount || 0,
      pendingTasks: todoCount + inProgressCount,
      tasks: {
        todo: todoCount,
        inProgress: inProgressCount,
        done: doneCount,
      },
      dailyRevenue,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};
