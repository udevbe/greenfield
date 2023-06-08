const width = '1.25rem'
const height = '1.25rem'

export function CloseIcon() {
  return (
    <svg width={width} height={height} viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(2 2)">
        <g transform="matrix(0 1 -1 0 17 0)">
          <path d="m5.5 11.5 6-6" />
          <path d="m5.5 5.5 6 6" />
        </g>
      </g>
    </svg>
  )
}

export function NetworkIcon() {
  return (
    <svg width={width} height={height} viewBox="0 0 72 72" id="emoji" xmlns="http://www.w3.org/2000/svg">
      <g id="color">
        <circle
          cx="36"
          cy="36"
          r="28"
          fill="#92D3F5"
          stroke="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
        />
      </g>
      <g id="hair" />
      <g id="skin" />
      <g id="skin-shadow" />
      <g id="line">
        <circle
          cx="36"
          cy="36"
          r="28"
          fill="none"
          stroke="#000000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
        />
        <path
          fill="none"
          stroke="#000000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
          d="M36,8v56c-8.5604,0-15.5-12.536-15.5-28S27.4396,8,36,8c8.5604,0,15.5,12.536,15.5,28S44.5604,64,36,64"
        />
        <path
          fill="none"
          stroke="#000000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
          d="M8,36"
        />
        <path
          fill="none"
          stroke="#000000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
          d="M64,36"
        />
        <line
          x1="64"
          x2="8"
          y1="36"
          y2="36"
          fill="none"
          stroke="#000000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
        />
        <line
          x1="60"
          x2="12"
          y1="22"
          y2="22"
          fill="none"
          stroke="#000000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
        />
        <line
          x1="60"
          x2="12"
          y1="50"
          y2="50"
          fill="none"
          stroke="#000000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
        />
      </g>
    </svg>
  )
}

export function ErrorIcon() {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      data-name="Layer 1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8,1A7,7,0,1,1,1,8,7.008,7.008,0,0,1,8,1M8,0a8,8,0,1,0,8,8A8,8,0,0,0,8,0Z" />
      <polygon points="11.476 5.002 10.476 5.002 10.476 4.002 9.476 4.002 9.476 5.002 8.476 5.002 8.476 6.002 9.476 6.002 9.476 7.002 10.476 7.002 10.476 6.002 11.476 6.002 11.476 5.002" />
      <polygon points="7.476 5.002 6.476 5.002 6.476 4.002 5.476 4.002 5.476 5.002 4.476 5.002 4.476 6.002 5.476 6.002 5.476 7.002 6.476 7.002 6.476 6.002 7.476 6.002 7.476 5.002" />
      <path d="M2.976,9v1H7.711v.426a2.633,2.633,0,1,0,5.265,0V9Zm5.735,1.426V10h1.483v2.043A1.629,1.629,0,0,1,8.711,10.426Zm3.265,0a1.628,1.628,0,0,1-1.482,1.617V10h1.482Z" />
    </svg>
  )
}

export function LoadingIcon() {
  return (
    <svg
      class="animate-spin"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <g fill="#000000" fill-rule="evenodd" clip-rule="evenodd">
        <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" opacity=".2" />
        <path d="M7.25.75A.75.75 0 018 0a8 8 0 018 8 .75.75 0 01-1.5 0A6.5 6.5 0 008 1.5a.75.75 0 01-.75-.75z" />
      </g>
    </svg>
  )
}

export function ClosedIcon() {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="#ff0000" fill-rule="nonzero">
          <path d="M4.28106169,4.22500888 L18.7764524,18.7209962 C19.0693396,19.0138954 19.0693299,19.4887691 18.7764306,19.7816563 C18.4835314,20.0745435 18.0086576,20.0745337 17.7157704,19.7816345 L13.9305541,15.9956947 L6.69263446,15.9958741 C4.65355477,15.9958741 3.00055408,14.3471503 3.00055408,12.3133463 C3.00055408,10.3210486 4.58677382,8.69827375 6.56830717,8.63286782 L3.22037969,5.28564722 C2.9274925,4.99274798 2.92750227,4.51787424 3.22040152,4.22498705 C3.51330076,3.93209986 3.9881745,3.93210963 4.28106169,4.22500888 Z M12,4.00069473 C15.1685311,4.00069473 16.9659849,6.09798511 17.2273993,8.63082111 L17.3073655,8.63081851 C19.3464452,8.63081851 20.9994459,10.2795424 20.9994459,12.3133463 C20.9994459,14.0797322 19.7525621,15.5556461 18.0887965,15.9132336 L7.93124025,5.75195301 C8.81517847,4.68600889 10.1815387,4.00069473 12,4.00069473 Z"></path>
        </g>
      </g>
    </svg>
  )
}

export function FrozenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 52 52">
      <path d="M27,3c0.6,0,1,0.4,1,1v45.9c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1V4c0-0.6,0.4-1,1-1H27z" />
      <path
        d="M26,17.2l-8.1-8.1c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4-0.4,1-0.4,1.4,0
	l1.4,1.4c0.4,0.4,0.4,1,0,1.4L26,17.2"
      />
      <path
        d="M26,36.7l8.1,8.1c0.4,0.4,0.4,1,0,1.4l-1.4,1.4c-0.4,0.4-1,0.4-1.4,0L26,42.3l-5.3,5.3c-0.4,0.4-1,0.4-1.4,0
	l-1.4-1.4c-0.4-0.4-0.4-1,0-1.4L26,36.7"
      />
      <path
        d="M47.1,15.6c0.3,0.5,0.2,1.1-0.4,1.4L7.2,40.3c-0.5,0.3-1.1,0.2-1.4-0.4l-1-1.7c-0.3-0.5-0.2-1.1,0.4-1.4
	l39.5-23.4c0.5-0.3,1.1-0.2,1.4,0.4L47.1,15.6z"
      />
      <path
        d="M34.4,22l2.8-11.1c0.1-0.6,0.6-0.9,1.2-0.7l1.9,0.5c0.6,0.1,0.9,0.6,0.7,1.2l-1.9,7.3l7.3,1.9
	c0.6,0.1,0.9,0.6,0.7,1.2l-0.5,1.9c-0.1,0.6-0.6,0.9-1.2,0.7L34.4,22"
      />
      <path
        d="M17.6,31.9L14.8,43c-0.1,0.6-0.6,0.9-1.2,0.7l-1.9-0.5c-0.6-0.1-0.9-0.6-0.7-1.2l1.9-7.3l-7.3-1.9
	c-0.6-0.1-0.9-0.6-0.7-1.2l0.5-1.9C5.5,29.1,6,28.8,6.6,29L17.6,31.9"
      />
      <path
        d="M5.9,13.9c0.3-0.5,0.9-0.7,1.4-0.4l39.5,23.4c0.5,0.3,0.7,0.9,0.4,1.4l-1,1.7c-0.3,0.5-0.9,0.7-1.4,0.4
	L5.2,17c-0.5-0.3-0.7-0.9-0.4-1.4L5.9,13.9z"
      />
      <path
        d="M17.6,22L6.5,24.9c-0.6,0.1-1.1-0.1-1.2-0.7l-0.5-1.9c-0.1-0.6,0.1-1.1,0.7-1.2l7.3-1.9l-1.9-7.3
	c-0.1-0.6,0.1-1.1,0.7-1.2l1.9-0.5c0.6-0.1,1.1,0.1,1.2,0.7L17.6,22"
      />
      <path
        d="M34.3,31.9L45.4,29c0.6-0.1,1.1,0.1,1.2,0.7l0.5,1.9c0.1,0.6-0.1,1.1-0.7,1.2l-7.3,1.9L41,42
	c0.1,0.6-0.1,1.1-0.7,1.2l-1.9,0.5c-0.6,0.1-1.1-0.1-1.2-0.7L34.3,31.9"
      />
    </svg>
  )
}
