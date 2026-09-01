import { useMemo } from "react";
import { FaArrowUp, FaMinus, FaArrowDown } from "react-icons/fa";

const PriorityChart = ({ tasks = [] }) => {
  const priorityData = useMemo(() => {
    const counts = {
      high: 0,
      medium: 0,
      low: 0,
    };

    tasks.forEach((task) => {
      const priority = String(
        task?.priority || task?.priorityLevel || "medium",
      ).toLowerCase();

      if (priority.includes("high")) {
        counts.high += 1;
      } else if (priority.includes("low")) {
        counts.low += 1;
      } else {
        counts.medium += 1;
      }
    });

    const total = counts.high + counts.medium + counts.low;

    const highPercent = total ? Math.round((counts.high / total) * 100) : 0;

    const mediumPercent = total ? Math.round((counts.medium / total) * 100) : 0;

    const lowPercent = total ? Math.round((counts.low / total) * 100) : 0;

    return {
      ...counts,
      total,
      highPercent,
      mediumPercent,
      lowPercent,
    };
  }, [tasks]);

  const { high, medium, low, total, highPercent, mediumPercent, lowPercent } =
    priorityData;

  if (total === 0) {
    return (
      <div className="priority-premium-empty">
        <div className="priority-empty-ring">
          <div className="priority-empty-ring-inner">
            <span>0</span>
            <small>TASKS</small>
          </div>
        </div>

        <div className="priority-empty-content">
          <h4>No priority data yet</h4>

          <p>
            Create tasks with priority levels to generate workspace priority
            intelligence.
          </p>
        </div>
      </div>
    );
  }

  const highAngle = highPercent * 3.6;
  const mediumAngle = (highPercent + mediumPercent) * 3.6;

  const priorityItems = [
    {
      key: "high",
      label: "High Priority",
      shortLabel: "High",
      value: high,
      percent: highPercent,
      icon: FaArrowUp,
    },
    {
      key: "medium",
      label: "Medium Priority",
      shortLabel: "Medium",
      value: medium,
      percent: mediumPercent,
      icon: FaMinus,
    },
    {
      key: "low",
      label: "Low Priority",
      shortLabel: "Low",
      value: low,
      percent: lowPercent,
      icon: FaArrowDown,
    },
  ];

  return (
    <div className="priority-premium">
      <div className="priority-donut-zone">
        <div
          className="priority-premium-donut"
          style={{
            "--high-angle": `${highAngle}deg`,
            "--medium-angle": `${mediumAngle}deg`,
          }}
        >
          <div className="priority-donut-hole">
            <span className="priority-total-label">TOTAL TASKS</span>

            <strong>{total}</strong>

            <span className="priority-total-subtitle">WORKSPACE</span>
          </div>
        </div>

        <div className="priority-donut-glow" />
      </div>

      <div className="priority-details">
        <div className="priority-details-heading">
          <div>
            <span>PRIORITY MIX</span>
            <strong>Task distribution</strong>
          </div>

          <div className="priority-total-badge">{total} Tasks</div>
        </div>

        <div className="priority-breakdown">
          {priorityItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                className={`priority-premium-item ${item.key}`}
                key={item.key}
              >
                <div className="priority-item-top">
                  <div className="priority-item-title">
                    <div className="priority-item-icon">
                      <Icon />
                    </div>

                    <div>
                      <strong>{item.label}</strong>
                      <span>{item.percent}% of tasks</span>
                    </div>
                  </div>

                  <div className="priority-item-number">
                    <strong>{item.value}</strong>
                    <span>{item.shortLabel}</span>
                  </div>
                </div>

                <div className="priority-item-progress">
                  <span
                    style={{
                      width: `${item.percent}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PriorityChart;
