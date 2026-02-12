import { useState } from 'react';

import Slider from 'rsuite/Slider';
import 'rsuite/dist/rsuite.min.css';
import { Link } from 'react-router-dom';
import DropdownBlog from '../DropdownBlog';

//Images
// import small from './../../../../assets/images/profile/small/pic1.jpg';
// import avatar1 from './../../../../assets/images/avatar/1.jpg';
// import avatar2 from './../../../../assets/images/avatar/2.jpg';
// import avatar3 from './../../../../assets/images/avatar/3.jpg';
// import avatar4 from './../../../../assets/images/avatar/4.jpg';
// import avatar5 from './../../../../assets/images/avatar/5.jpg';
// import avatar6 from './../../../../assets/images/avatar/6.jpg';

const QuickTransferBlog = () => {
	const [value, setValue] = useState(20);

	return (
		<>
			<div className="card">
				<div className="card-header border-0 pb-0">
					<div>
						<h4 className="card-title mb-2">Quick Dispatch</h4>
						<span className="fs-12">
							Manage panel dispatch assignments instantly
						</span>
					</div>
					<DropdownBlog />
				</div>

				<div className="card-body">
					<div className="user-bx">
						{/* <img src={small} alt="" /> */}
						<div>
							<h6 className="user-name">Plant Supervisor</h6>
							<span className="meta">KLK Solar Unit</span>
						</div>
						<i className="las la-check-circle check-icon"></i>
					</div>

					<h4 className="mt-3 mb-3">
						Recent Dispatch Team
						<Link
							to={"#"}
							className="fs-16 float-end text-secondary font-w600"
						>
							View All
						</Link>
					</h4>

					<ul className="user-list">
						{/* <li><img src={avatar1} alt="" /></li>
						<li><img src={avatar2} alt="" /></li>
						<li><img src={avatar3} alt="" /></li>
						<li><img src={avatar4} alt="" /></li>
						<li><img src={avatar5} alt="" /></li>
						<li><img src={avatar6} alt="" /></li> */}
					</ul>

					<h4 className="mt-3 mb-0">Select Panels for Dispatch</h4>

					<div className="format-slider">
						<input
							className="form-control amount-input"
							value={`${value} Panels`}
							readOnly
						/>

						<div id="combined">
							<Slider
								progress
								value={value}
								onChange={(val) => setValue(val)}
							/>
						</div>
					</div>

					<div className="text-secondary fs-16 d-flex justify-content-between font-w600 mt-4">
						<span>Available Panels</span>
						<span>1,245 Units</span>
					</div>
				</div>

				<div className="card-footer border-0 pt-0">
					<Link
						to={"#"}
						className="btn btn-primary d-block btn-lg text-uppercase"
					>
						Assign Dispatch
					</Link>
				</div>
			</div>
		</>
	);
};

export default QuickTransferBlog;
