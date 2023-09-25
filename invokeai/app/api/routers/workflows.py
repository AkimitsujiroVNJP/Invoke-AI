from fastapi import APIRouter, Body, Path

from invokeai.app.api.dependencies import ApiDependencies
from invokeai.app.services.workflow_records.workflow_records_common import WorkflowField

workflows_router = APIRouter(prefix="/v1/workflows", tags=["workflows"])


@workflows_router.get(
    "/i/{workflow_id}",
    operation_id="get_workflow",
    responses={
        200: {"model": WorkflowField},
    },
)
async def get_workflow(
    workflow_id: str = Path(description="The workflow to get"),
) -> WorkflowField:
    """Gets a workflow"""
    return ApiDependencies.invoker.services.workflow_records.get(workflow_id)


@workflows_router.post(
    "/create",
    operation_id="create_workflow",
    responses={
        200: {"model": WorkflowField},
    },
)
async def create_workflow(
    workflow: WorkflowField = Body(description="The workflow to create"),
) -> WorkflowField:
    """Creates a workflow"""
    return ApiDependencies.invoker.services.workflow_records.create(workflow)
