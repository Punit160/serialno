import { Link } from 'react-router-dom';

const CardBlog = () => {
	return (
		<>
			<div className="row">
				<div className="col-xl-12">
					<div className="card coin-card">
						<div className="card-body d-sm-flex d-block align-items-center">
							<span className="coin-icon">
								<svg width="38" height="41" viewBox="0 0 38 41" fill="none" xmlns="http://www.w3.org/2000/svg">
									<g>
										<path d="M14.0413 32.5832C15.7416 32.5934 17.4269 32.2659 18.9997 31.6199C20.5708 32.2714 22.2572 32.5991 23.958 32.5832C29.1218 32.5832 33.1663 29.8278 33.1663 26.3088V20.441C33.1663 16.922 29.1218 14.1666 23.958 14.1666C23.7186 14.1666 23.4834 14.1779 23.2497 14.1906V7.55498C23.2497 4.10823 19.2051 1.41656 14.0413 1.41656C8.87759 1.41656 4.83301 4.10823 4.83301 7.55498V26.4448C4.83301 29.8916 8.87759 32.5832 14.0413 32.5832ZM30.333 26.3088C30.333 27.9366 27.715 29.7499 23.958 29.7499C20.201 29.7499 17.583 27.9366 17.583 26.3088V24.9984C19.5015 26.1652 21.7131 26.7604 23.958 26.714C26.203 26.7604 28.4145 26.1652 30.333 24.9984V26.3088ZM23.958 16.9999C27.715 16.9999 30.333 18.8132 30.333 20.441C30.333 22.0687 27.715 23.8807 23.958 23.8807C20.201 23.8807 17.583 22.0673 17.583 20.441C17.583 18.8147 20.201 16.9999 23.958 16.9999ZM14.0413 4.2499C17.7983 4.2499 20.4163 5.9924 20.4163 7.55498C20.4163 9.11757 17.7983 10.8615 14.0413 10.8615C10.2843 10.8615 7.66634 9.11898 7.66634 7.55498C7.66634 5.99098 10.2843 4.2499 14.0413 4.2499Z" fill="#fff"></path>
									</g>
								</svg>
							</span>
							<div>
								<h3 className="text-white">Solar Tracker Dashboard</h3>
								<p>Monitor real-time performance of your solar panels, track energy output, and optimize sunlight capture for maximum efficiency.</p>
								<Link to={"#"} className="text-white">Learn more {`>>`}</Link>
							</div>
						</div>
					</div>
				</div>

				<div className="col-md-6">
					<div className="card progress-card">
						<div className="card-body d-flex">
							<div className="me-auto">
								<h4 className="card-title">Total Energy Generated</h4>
								<div className="d-flex align-items-center">
									<h2 className="fs-38 mb-0">12,340 kWh</h2>
									<div className="text-success transaction-caret">
										<i className="fa fa-sort-asc"></i>
										<p className="mb-0">+4.2%</p>
									</div>
								</div>
							</div>		
							<div className="progress progress-vertical-bottom" style={{minHeight:"110px", minWidth:"10px" }}>
								<div className="progress-bar bg-warning" style={{width:"10px", height:"40%"}} role="progressbar">
									<span className="sr-only">40% Complete</span>
								</div>
							</div>
							<div className="progress progress-vertical-bottom" style={{minHeight:"110px",minWidth:"10px"}}>
								<div className="progress-bar bg-warning" style={{width:"10px", height:"55%"}} role="progressbar">
									<span className="sr-only">55% Complete</span>
								</div>
							</div>
							<div className="progress progress-vertical-bottom" style={{minHeight:"110px", minWidth:"10px"}}>
								<div className="progress-bar bg-warning" style={{width:"10px", height:"80%"}} role="progressbar">
									<span className="sr-only">80% Complete</span>
								</div>
							</div>
							<div className="progress progress-vertical-bottom" style={{minHeight:"110px",minWidth:"10px"}}>
								<div className="progress-bar bg-warning" style={{width:"10px", height:"50%"}} role="progressbar">
									<span className="sr-only">50% Complete</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="col-md-6">
					<div className="card">
						<div className="card-body">
							<h4 className="card-title">Panel Efficiency</h4>
							<div className="d-flex align-items-center">
								<div className="me-auto">
									<div className="progress mt-4" style={{height:"10px"}}>
										<div className="progress-bar bg-warning progress-animated" style={{width: "72%", height:"10px"}} role="progressbar">
											<span className="sr-only">72% Complete</span>
										</div>
									</div>
									<p className="fs-16 mb-0 mt-2"><span className="text-success">+3% </span>from last week</p>
								</div>
								<h2 className="fs-38">72%</h2>
							</div>
						</div>
					</div>
				</div>

				<div className="col-sm-6">
					<div className="card">
						<div className="card-body">
							<h4 className="card-title mt-2">Sunlight Exposure</h4>
							<div className="d-flex align-items-center mt-3 mb-2">
								<h2 className="fs-38 mb-0 me-3">8.5 hrs</h2>
								<span className="badge badge-success">+0.8%</span>
							</div>
						</div>
					</div>
				</div>

				<div className="col-sm-6">
					<div className="card">
						<div className="card-body">
							<h4 className="card-title mt-2">Operational Panels</h4>
							<div className="d-flex align-items-center mt-3 mb-2">
								<h2 className="fs-38 mb-0 me-3">146</h2>
								<span className="badge badge-danger">-1.5%</span>
							</div>
						</div>
					</div>
				</div>

			</div>
		</>
	)
}

export default CardBlog;
