let panelStatus: boolean = true;

export const getPanelStatus = () => panelStatus;
export const setPanelStatus = (status: boolean) => {
  panelStatus = status;
};
