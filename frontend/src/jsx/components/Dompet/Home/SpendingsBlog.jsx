import { Link } from 'react-router-dom';
import DropdownBlog from '../DropdownBlog';

const SpendingsBlog = () => {
	return (
		<>
			<div className="card">
				<div className="card-header border-0 pb-0">
					<div>
						<h4 className="card-title mb-2">Operational Status</h4>
						<span className="fs-12">
							Current progress of solar panel operations
						</span>
					</div>
					<DropdownBlog />
				</div>

				<div className="card-body">
					<div className="progress default-progress">
						<div
							className="progress-bar bg-gradient-1 progress-animated"
							style={{ width: "45%", height: "20px" }}
							role="progressbar"
						>
							<span className="sr-only">45% Complete</span>
						</div>
					</div>
					<div className="d-flex align-items-end mt-2 pb-3 justify-content-between">
						<span>Panels Generated</span>
						<span className="fs-18">
							<span className="text-black pe-2">450</span>/1000
						</span>
					</div>

					<div className="progress default-progress mt-4">
						<div
							className="progress-bar bg-gradient-2 progress-animated"
							style={{ width: "70%", height: "20px" }}
							role="progressbar"
						>
							<span className="sr-only">70% Complete</span>
						</div>
					</div>
					<div className="d-flex align-items-end mt-2 pb-3 justify-content-between">
						<span>Panels Dispatched</span>
						<span className="fs-18">
							<span className="text-black pe-2">700</span>/1000
						</span>
					</div>

					<div className="progress default-progress mt-4">
						<div
							className="progress-bar bg-gradient-3 progress-animated"
							style={{ width: "35%", height: "20px" }}
							role="progressbar"
						>
							<span className="sr-only">35% Complete</span>
						</div>
					</div>
					<div className="d-flex align-items-end mt-2 pb-3 justify-content-between">
						<span>Quality Inspection</span>
						<span className="fs-18">
							<span className="text-black pe-2">350</span>/1000
						</span>
					</div>

					<div className="progress default-progress mt-4">
						<div
							className="progress-bar bg-gradient-4 progress-animated"
							style={{ width: "95%", height: "20px" }}
							role="progressbar"
						>
							<span className="sr-only">95% Complete</span>
						</div>
					</div>
					<div className="d-flex align-items-end mt-2 justify-content-between">
						<span>Plant Capacity Utilized</span>
						<span className="fs-18">
							<span className="text-black pe-2">95%</span>/100%
						</span>
					</div>
				</div>

				<div className="card-footer border-0 pt-0">
					<Link
						to={"#"}
						className="btn btn-outline-primary d-block btn-lg"
					>
						View Detailed Report
					</Link>
				</div>
			</div>
		</>
	);
};

export default SpendingsBlog;
