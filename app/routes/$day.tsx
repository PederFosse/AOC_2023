import { type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import { useFetcher, useLoaderData, useParams } from '@remix-run/react';
import { useEffect } from 'react';
import { json } from 'react-router';
import { TaskSolver } from '~/days/task-solver';
import { classNames } from '~/utils';

const AOC_SESSION_COOKIE =
  'session=53616c7465645f5fbf983db45600a6dd7a947726b53b3871e310f3a9d573bb4f3402b95e83002dd843f06c7796741f133c7c6c4bef10116ff48968ba93eec4d7';

export async function loader({ params }: LoaderFunctionArgs) {
  const taskSolver = TaskSolver.getInstance();

  if (typeof params.day !== 'string') {
    return json('Invalid params, missing day', { status: 400 });
  }

  const task = taskSolver.getTask(params.day);
  if (!task) {
    return json('Task not found', { status: 404 });
  }

  return json({ taskName: task.name });
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (typeof params.day !== 'string') {
    return json('Invalid params, missing day', { status: 400 });
  }

  const formData = await request.formData();

  const testData = formData.get('test-data');

  let data: string;

  if (testData && typeof testData === 'string') {
    // <textarea> component uses \r\n for line-breaks
    data = testData.replaceAll('\r', '');
  } else {
    try {
      const fileContents = await fetch(`https://adventofcode.com/2022/day/1/input`, {
        headers: {
          cookie: AOC_SESSION_COOKIE,
        },
      });

      data = await fileContents.text();
    } catch (err) {
      return json('Failed getting input data', { status: 404 });
    }
  }

  const task = TaskSolver.getInstance().getTask(params.day);
  if (!task) {
    return json('Task not found', { status: 404 });
  }

  return { result: task.solve(data) };
}

export default function Day() {
  const fetcher = useFetcher();
  const params = useParams();
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className={classNames('p-5 min-h-screen w-full')}>
      <h1>Day {params.day?.slice(3)}</h1>
      <div className="mt-24 flex items-center justify-center h-[40rem]">
        <div className="h-full border-r-2 border-gray-500 border-dotted pr-4">
          <fetcher.Form method="post" encType="multipart/form-data" className="flex flex-col justify-evenly h-full">
            <textarea
              name="test-data"
              className="p-2 border-gray-900 border shadow-sm rounded-lg h-96 bg-gray-500 text-wallpaper"
            />
            <div className="flex justify-center items-center">
              <button type="submit" className="text-wallpaper bg-secondary px-2 rounded-md">
                Solve task
              </button>
            </div>
          </fetcher.Form>
        </div>
        <div className="h-full grow">
          <div className="">
            <pre
              className={classNames(
                'break-words bg-gray-900/90 rounded-lg m-14 overflow-auto pl-4',
                fetcher.data && 'p-3'
              )}
            >
              {JSON.stringify(fetcher.data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

const useAutosizeTextArea = (textAreaRef: HTMLTextAreaElement | null, value: string) => {
  useEffect(() => {
    if (textAreaRef) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.style.height = '0px';
      const scrollHeight = textAreaRef.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.style.height = scrollHeight + 'px';
    }
  }, [textAreaRef, value]);
};
