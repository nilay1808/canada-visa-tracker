interface TimelineItem {
  updatedAt: string;
  title: string;
  description: string;
}

interface TimelineProps {
  timeline: TimelineItem[];
}

export function Timeline({ timeline }: TimelineProps) {
  return (
    <ol className="relative border-s border-gray-200 dark:border-gray-700">
      {timeline.map((item, i) => (
        <TimelineItem
          key={item.updatedAt}
          item={item}
          isLast={i + 1 === timeline.length}
        />
      ))}
    </ol>
  );
}

function TimelineItem({
  item,
  isLast = false,
}: {
  item: TimelineItem;
  isLast?: boolean;
}) {
  return (
    <li className={isLast ? "ms-4" : "mb-10 ms-4"}>
      <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
        {item.updatedAt}
      </time>
      <h3 className="text-lg font-semibold">{item.title}</h3>
      <p className="font-normal text-gray-500 dark:text-gray-400">
        {item.description}
      </p>
    </li>
  );
}
