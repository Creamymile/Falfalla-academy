import { Component, type ErrorInfo, type ReactNode } from "react";
import { Coffee } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  componentDidMount() {
    // Reset error state on hash navigation so users can recover
    window.addEventListener("hashchange", this.resetError);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.resetError);
  }

  resetError = () => {
    if (this.state.hasError) {
      this.setState({ hasError: false });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="gate">
          <Coffee size={48} style={{ marginBottom: "1rem", color: "#a0522d" }} />
          <h2>Something went wrong</h2>
          <p style={{ margin: "1rem 0", color: "#6b5e50" }}>
            An unexpected error occurred. Please reload the page to try again.
          </p>
          <button className="primary" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
