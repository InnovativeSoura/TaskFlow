const ReportCards = ({ projects, tasks }) => {

    const completed = tasks.filter(
        t => t.status === "Completed"
    ).length;

    const pending = tasks.filter(
        t => t.status !== "Completed"
    ).length;

    return (

        <div className="report-cards">

            <div className="report-card">

                <h2>{projects.length}</h2>

                <p>Total Projects</p>

            </div>

            <div className="report-card">

                <h2>{tasks.length}</h2>

                <p>Total Tasks</p>

            </div>

            <div className="report-card">

                <h2>{completed}</h2>

                <p>Completed</p>

            </div>

            <div className="report-card">

                <h2>{pending}</h2>

                <p>Pending</p>

            </div>

        </div>

    );

};

export default ReportCards;