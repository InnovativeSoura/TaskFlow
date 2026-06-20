import { motion } from "framer-motion";

function StatCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
    >
      <p className="text-slate-400">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-4">
        {value}
      </h2>
    </motion.div>
  );
}

export default StatCard;