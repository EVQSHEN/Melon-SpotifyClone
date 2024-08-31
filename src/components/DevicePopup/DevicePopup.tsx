import React, { MouseEvent } from 'react';
import { changeDevice, setActiveDeviceFirstRender } from '@/api/spotify';
import { DevicePopupProps } from '@/types/interface';
import IconSVG from '@/components/IconSVG/IconSVG';

const DevicePopup: React.FC<DevicePopupProps> = ({
  device,
  activeDevice,
  setActiveDevice,
  setDevice,
}) => {
  const [devicePopup, setDevicePopup] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  function devicePopupFunc(e: MouseEvent) {
    e.stopPropagation();
    setDevicePopup(!devicePopup);
  }

  React.useEffect(() => {
    setActiveDeviceFirstRender(setDevice);
    const handleClick: EventListener = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDevicePopup(false);
      }
    };
    if (devicePopup) {
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }
  }, [devicePopup, setDevice]);

  return (
    <>
      <div onClick={(e) => devicePopupFunc(e)}>
        <IconSVG
          name="device"
          className="cursor-pointer fill-white text-center mr-3"
          width="19"
          height="28"
        />
      </div>
      <div
        ref={ref}
        className="absolute bottom-7 md:right-10 right-0 w-60 bg-neutral-950 rounded-lg max-h-48 overflow-y-auto"
      >
        {devicePopup &&
          device.map((el) => (
            <div
              className={el.id === activeDevice ? 'bg-blue-600 p-2 rounded-md' : 'p-2 rounded-md'}
              onClick={() => changeDevice(el.id as string, setDevice, setActiveDevice)}
              key={el.id as string}
            >
              {el.name}
            </div>
          ))}
      </div>
    </>
  );
};

export default DevicePopup;
