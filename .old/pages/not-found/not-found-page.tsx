import { useRouter } from "../../platform/router/preact.tsx";
import "./not-found-page.css";
import { Fragment, h } from "preact";

export function NotFoundPage() {
  const router = useRouter();
  return (
    <Fragment>
      <div>404 Not Found</div>
      <div>
        <pre>{JSON.stringify(router.req, null, 2)}</pre>
      </div>
    </Fragment>
  );
}
