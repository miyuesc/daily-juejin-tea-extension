let panelStatus: boolean = false;

export const getPanelStatus = () => panelStatus;
export const setPanelStatus = (status: boolean) => {
  panelStatus = status;
};
