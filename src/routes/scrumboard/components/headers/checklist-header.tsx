import { CheckSquareOutlined } from "@ant-design/icons";
import { Space } from "antd";

import { Text } from "@/components";
import type { Task } from "@/graphql/schema.types";

type Props = {
  checklist?: Task["checklist"];
};

export const ChecklistHeader = ({ checklist = [] }: Props) => {
  const completed = checklist.filter((item) => item?.checked).length;
  const total = checklist.length;

  return (
    <Space size={15} align="start" style={{ marginBottom: "12px" }}>
      {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
      <CheckSquareOutlined />
      <Text strong>Checklist </Text>
      <Text type="secondary">
        {completed}/{total}
      </Text>
    </Space>
  );
};
