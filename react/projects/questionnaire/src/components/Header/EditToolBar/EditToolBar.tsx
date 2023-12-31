import { Button, Space, Tooltip } from "antd";
import { FC } from "react";
import {
  DeleteOutlined,
  CopyOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { Question } from "../../../model/question";
import {
  copySelectedQuestion,
  deleteSelectedQuestion,
  toggleHideSelectedQuestion,
  toggleLockSelectedQuestion,
} from "../../../store/modules/questionnaireStore";

const EditToolBar: FC = () => {
  const selectedQuestion: Question | null = useSelector(
    (state: RootState) => state.questionnaire.selectedQuestion
  );
  const dispatch = useDispatch();
  const locked = selectedQuestion?.locked;
  return (
    <Space className="edit-tool-bar">
      <Tooltip title={locked ? "unlock" : "lock"}>
        <Button
          shape="circle"
          icon={locked ? <UnlockOutlined /> : <LockOutlined />}
          type={locked ? "primary" : "default"}
          onClick={() => {
            dispatch(toggleLockSelectedQuestion());
          }}
        />
      </Tooltip>
      <Tooltip title={"delete"}>
        <Button
          shape="circle"
          icon={<DeleteOutlined />}
          onClick={() => {
            dispatch(deleteSelectedQuestion());
          }}
        />
      </Tooltip>
      <Tooltip title={"copy"}>
        <Button
          shape="circle"
          icon={<CopyOutlined />}
          onClick={() => {
            dispatch(copySelectedQuestion());
          }}
        />
      </Tooltip>
      <Tooltip title={"hide"}>
        <Button
          shape="circle"
          icon={<EyeInvisibleOutlined />}
          onClick={() => {
            dispatch(toggleHideSelectedQuestion());
          }}
        />
      </Tooltip>
    </Space>
  );
};
export default EditToolBar;
