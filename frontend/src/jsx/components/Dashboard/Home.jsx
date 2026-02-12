import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";


//Components
import { ThemeContext } from "../../../context/ThemeContext";
import DropdownBlog from '../Dompet/DropdownBlog';
import PreviousTab from '../Dompet/Home/PreviousTab';
import InvoiceCard from '../Dompet/Home/InvoiceCard';
import SpendingsBlog from '../Dompet/Home/SpendingsBlog';
import QuickTransferBlog from '../Dompet/Home/QuickTransferBlog';
import CardBlog from '../Dompet/Home/CardBlog';

const PolarChart = loadable(() =>
	pMinDelay(import("../Dompet/Home/PolarChart"), 1000)
);
const ActivityApexBarGraph = loadable(() =>
	pMinDelay(import("../Dompet/Home/ActivityApexBarGraph"), 1000)
);
const TransactionApexBar = loadable(() =>
	pMinDelay(import("../Dompet/Home/TransactionApexBar"), 1000)
);

const Home = () => {
	const [checked, setChecked] = useState(true);
	const { changeBackground,
		// changeSideBarStyle, 
		changePrimaryColor,
		chnageSidebarColor,
	} = useContext(ThemeContext);
	useEffect(() => {
		changeBackground({ value: "light", label: "Light" });
		// if (window.innerWidth >= 768) {
		// 	changeSideBarStyle({ value: "full", label: "full" });
		// }
		changePrimaryColor("color_1");
		chnageSidebarColor("color_1");
	}, [
	]);

	return (
		<>
			<div className="row invoice-card-row">
				<InvoiceCard />
			</div>
			<div className="row">
				


				<div className="col-xl-9 col-xxl-12">
					<div className="card">
						<div className="card-body">
							<div className="row align-items-center">

								{/* Left Main Card */}
								<div className="col-xl-6">
									<div className="card-bx bg-blue">
										{/* <img className="pattern-img" src={pattern6} alt="" /> */}
										<div className="card-info text-white">
											{/* <img src={circle} className="mb-4" alt="" /> */}
											<h2 className="text-white card-balance">12,480</h2>
											<p className="fs-16">Total Panels Tracked</p>
											<span>+5.2% growth compared to last week</span>
										</div>
										<Link to={"#"} className="change-btn" id="change-btn">
											<i className="fa fa-caret-up up-ico" /> Update
											<span className="reload-icon">
												<i className="fa fa-refresh reload active" />
											</span>
										</Link>
									</div>
								</div>

								{/* Right Overview */}
								<div className="col-xl-6">
									<div className="row mt-xl-0 mt-4">

										<div className="col-md-6">	
											<h4 className="card-title">Panel Status Overview</h4>
											<span>
												Real-time distribution of solar panels across
												generation, dispatch, and inspection stages.
											</span>

											<ul className="card-list mt-4">
												<li>
													<span className="bg-blue circle"></span>
													Generated
													<span>45%</span>
												</li>
												<li>
													<span className="bg-success circle"></span>
													Dispatched
													<span>35%</span>
												</li>
												<li>
													<span className="bg-warning circle"></span>
													Pending Dispatch
													<span>15%</span>
												</li>
												<li>
													<span className="bg-light circle"></span>
													Damaged
													<span>5%</span>
												</li>
											</ul>
										</div>

										<div className="col-md-6">
											<PolarChart />
										</div>

									</div>
								</div>

							</div>
						</div>
					</div>
				</div>


				<div className="col-xl-3 col-xxl-5">
					<div className="card">
						<div className="card-header pb-0 border-0">
							<div>
								<h4 className="card-title mb-2">Plant Activity</h4>
								<h2 className="mb-0">78,120 kWh</h2>
							</div>
							<ul className="card-list">
								<li className="justify-content-end">
									Energy Generated
									<span className="bg-success circle me-0 ms-2"></span>
								</li>
								<li className="justify-content-end">
									Energy Dispatched
									<span className="oranger-bg circle me-0 ms-2"></span>
								</li>
							</ul>
						</div>
						<div className="card-body pb-0 pt-3">
							<div id="chartBar" className="bar-chart flex-grow-1">
								<ActivityApexBarGraph />
							</div>
						</div>
					</div>
				</div>



				<div className="col-xl-3 col-xxl-7">
					<QuickTransferBlog />
				</div>
				<div className="col-xl-3 col-xxl-5">
					<SpendingsBlog />
				</div>

				<div className="col-xl-6 col-xxl-7">
					<div className="card">
						<div className="card-header d-flex flex-wrap border-0 pb-0">
							<div className="me-auto mb-sm-0 mb-3">
								<h4 className="card-title mb-2">Panel Movement Overview</h4>
								<span className="fs-12">
									Daily tracking of generated vs dispatched panels
								</span>
							</div>

							<Link
								to={"#"}
								className="btn btn-rounded btn-md btn-primary mr-3 me-3"
							>
								<i className="las la-download scale5 me-3" />
								Download Report
							</Link>

							<DropdownBlog />
						</div>

						<div className="card-body pb-2">
							<div className="d-sm-flex d-block">
								<div className="form-check toggle-switch text-end form-switch me-4">
									<input
										className="form-check-input"
										type="checkbox"
										id="flexSwitchCheckDefault"
										defaultChecked={checked}
										onChange={() => setChecked(!checked)}
									/>
									<label
										className="form-check-label"
										htmlFor="flexSwitchCheckDefault"
									>
										Units
									</label>
								</div>

								<div className="form-check toggle-switch text-end form-switch me-auto">
									<input
										className="form-check-input"
										type="checkbox"
										id="flexSwitchCheckDefault1"
									/>
									<label
										className="form-check-label"
										htmlFor="flexSwitchCheckDefault1"
									>
										Analytics
									</label>
								</div>

								<ul className="card-list d-flex mt-sm-0 mt-3">
									<li className="me-3">
										<span className="bg-success circle"></span>
										Panels Generated
									</li>
									<li>
										<span className="oranger-bg circle"></span>
										Panels Dispatched
									</li>
								</ul>
							</div>

							<div id="chartBar2" className="bar-chart">
								<TransactionApexBar />
							</div>
						</div>
					</div>
				</div>


				<div className="col-xl-6 col-xxl-12">
					<PreviousTab />
				</div>
				<div className="col-xl-6 col-xxl-12">
					<CardBlog />
				</div>

			</div>
		</>
	)
}
export default Home;