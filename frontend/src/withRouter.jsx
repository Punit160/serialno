import { useLocation, useNavigate, useParams } from "react-router-dom";

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  ComponentWithRouterProp.displayName = `withRouter(${
    Component.displayName || Component.name || "Component"
  })`;

  return ComponentWithRouterProp;
}
