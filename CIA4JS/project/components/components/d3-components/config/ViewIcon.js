const PROJECT_ICON = {
    ROOTNODE_ICON: `
    <path fill="#40B6E0" 
    fill-opacity=".6" 
    fill-rule="evenodd" 
    d="M1,13 L15,13 L15,4 L7.98457,4 L6.69633,2.71149 C6.22161957,2.28559443 5.63665337,2.03457993 4.99983215,2 L1,2 L1,13 Z"/>
    `,

    PACKAGE_ICON : `
    <path fill="#9AA7B0" 
          fill-opacity=".8" 
          fill-rule="evenodd" 
          d="M6,10.4951 C4.896,10.4951 4.001,9.6001 4,8.4981 C3.999,7.3941 4.894,6.5001 5.997,6.5001 C7.102,6.5001 7.997,7.3941 7.998,8.4981 C7.999,9.6001 7.104,10.4951 6,10.4951 Z M7.984,4.0001 L6.696,2.7111 C6.305,2.3201 5.532,2.0001 4.979,2.0001 L1.051,2.0001 C1.023,2.0001 1,2.0231 1,2.0511 L1,13.0001 L15,13.0001 L15,4.0001 L7.984,4.0001 Z"/>
    `,
    CLASS_ICON: `
    <g fill="none" fill-rule="evenodd">
        <path fill="#40B6E0" fill-opacity=".6" d="M15,8 C15,11.866 11.866,15 8,15 C4.134,15 1,11.866 1,8 C1,4.134 4.134,1 8,1 C11.866,1 15,4.134 15,8"/>
        <path fill="#231F20" fill-opacity=".7" d="M5,4.28253174 C4.53,4.74153174 4.028,4.978 3.1,5 C2.061,5.022 1,4.2794 1,3.0004 C1,1.7124 1.971,1 3.1,1 C3.94833171,1 4.54833171,1.18475342 4.9,1.55426025 L5.5162,0.836730957 C4.8293999,0.270175195 4.28826904,0.0004 3.0982,0.0004 C1.3402,0.0004 0.0002,1.3584 0.0002,3.0004 C0.0002,4.6824 1.3642,6.0004 3.0022,6.0004 C4.29284668,6.0004 5.0232,5.5934 5.6162,4.9814 C5.2054,4.51548783 5,4.28253174 5,4.28253174 Z" transform="translate(5 5)"/>
    </g>
    `,
    METHOD_ICON: `
    <g fill="none" fill-rule="evenodd">
        <path fill="#F98B9E" fill-opacity=".6" d="M15,8 C15,11.866 11.866,15 8,15 C4.134,15 1,11.866 1,8 C1,4.134 4.134,1 8,1 C11.866,1 15,4.134 15,8"/>
        <path fill="#231F20" fill-opacity=".7" d="M6.9922,2 C6.9912,1.251 6.63513184,0.0003 4.98162842,0.0003 C4.11224365,0.0003 3.6576,0.502 3.5986,0.6 C3.28363037,0.194116211 2.94411621,0.0003 2.1,0.0003 C1.63194173,0.0003 1.26527507,0.0999436667 1,0.299231 L1,0.0003 L0,0.0003 L0,5.0003 L1,5.0003 C0.966666667,3.1563 0.966666667,2.1562 1,2 C1.05,1.7657 1.05,1 2,1 C2.95,1 2.999,1.537 3,2 L3,5.0003 L4,5.0003 L4,2 C4,1.686 3.95911952,1 4.98162842,1 C6.00413731,1 6.00413731,1.73961181 6.00469971,2 C6.00469971,2.79041884 6.00469971,3.38323296 6.00469971,3.77844238 C6.00469971,4.0499663 6.00469971,4.45725217 6.00469971,5.0003 L6.9972,5.0003 L6.9922,2 Z" transform="translate(5 6)"/>
    </g>
    `,
    FIELD_ICON: `
    <g fill="none" fill-rule="evenodd">
        <path fill="#F4AF3D" fill-opacity=".6" d="M15,8 C15,11.866 11.866,15 8,15 C4.134,15 1,11.866 1,8 C1,4.134 4.134,1 8,1 C11.866,1 15,4.134 15,8"/>
        <path fill="#231F20" fill-opacity=".7" d="M1,8 L2,8 L2,4 L3.5,4 L3.5,3 L2,3 C1.99687783,2.36169171 1.99509925,2.02835838 1.99466424,2 C1.98704681,1.50341351 2.13289549,1.0728225 2.43221029,0.972167969 C2.91964141,0.808253079 3.56884985,1.02114795 3.68984985,1.06414795 L3.98519897,0.226043701 C3.90948298,0.198825534 3.4559021,0 2.81140137,0 C2.16690063,1.40512602e-16 1.81677246,0.0614013672 1.4818929,0.388793945 C1.16513106,0.698473875 1.01614114,1.22015248 1.00124609,2 C1.00039414,2.04460465 0.999980878,2.95274463 1,3 C1.00000736,3.01819872 0.666674031,3.01819872 0,3 L0,3.972 L1,3.972 L1,8 Z" transform="translate(6 4)"/>
    </g>
    `,
    INITIALIZE_ICON: `
    <g fill="none" fill-rule="evenodd">
        <path fill="#F98B9E" fill-opacity=".6" d="M14.7279065,9.93922898 L13.2249195,9.85558898 L11.9495635,6.5 L11.0406489,6.5 L9.77115318,9.85558898 L6.01939023,10.0717163 L6.01939023,10.8769531 L8.70388068,13.140316 L8.21285589,14.9968255 C8.14216225,14.9989368 8.07120528,15 8,15 C4.13400675,15 1,11.8659932 1,8 C1,4.13400675 4.13400675,1 8,1 C11.8659932,1 15,4.13400675 15,8 C15,8.6727991 14.905082,9.32342891 14.7279065,9.93922898 Z"/>
        <polygon fill="#9AA7B0" points="11.498 14.163 8.718 15.956 9.564 12.758 7 10.668 10.303 10.484 11.498 7.4 12.693 10.484 15.996 10.668 13.432 12.758 14.278 15.956"/>
        <path fill="#231F20" fill-opacity=".7" d="M10.7568959,7.25002881 C10.6072458,7.10510886 10.3670933,7 9.98162842,7 C8.95911952,7 9,7.686 9,8 L9,9.9000127 L8,9.95761957 L8,8 C7.999,7.537 7.95,7 7,7 C6.05,7 6.05,7.7657 6,8 C5.96666667,8.1562 5.96666667,9.1563 6,11.0003 L5,11.0003 L5,6.0003 L6,6.0003 L6,6.299231 C6.26527507,6.09994367 6.63194173,6.0003 7.1,6.0003 C7.94411621,6.0003 8.28363037,6.19411621 8.5986,6.6 C8.6576,6.502 9.11224365,6.0003 9.98162842,6.0003 C10.6518091,6.0003 11.1088526,6.20575975 11.415504,6.5 L11.0406489,6.5 L10.7568959,7.25002881 Z"/>
    </g>
    `,
    ENUM_ICON: `
    <g fill="none" fill-rule="evenodd">
        <path fill="#40B6E0" fill-opacity=".6" d="M15,8 C15,11.866 11.866,15 8,15 C4.134,15 1,11.866 1,8 C1,4.134 4.134,1 8,1 C11.866,1 15,4.134 15,8"/>
        <polygon fill="#231F20" fill-opacity=".7" points="4 6 0 6 0 0 4 0 4 1 1 1 1 2 3.5 2 3.5 3 1 3 1 5 4 5" transform="translate(6 5)"/>
    </g>
    `,
    INTERFACE_NODE: `
    <g fill="none" fill-rule="evenodd">
        <path fill="#62B543" fill-opacity=".6" d="M15,8 C15,11.866 11.866,15 8,15 C4.134,15 1,11.866 1,8 C1,4.134 4.134,1 8,1 C11.866,1 15,4.134 15,8"/>
        <polygon fill="#231F20" fill-rule="nonzero" points="8.6 10 8.6 6 10 6 10 5 6 5 6 6 7.4 6 7.4 10 6 10.007 6 11 10 11 10 10" opacity=".7"/>
    </g>
    `,
    XML_FILE_NODE: `
    <g fill="none" fill-rule="evenodd">
        <polygon fill="#F26522" fill-opacity=".7" points="1 16 16 16 16 9 1 9"/>
        <polygon fill="#9AA7B0" fill-opacity=".8" points="7 1 3 5 7 5"/>
        <polygon fill="#9AA7B0" fill-opacity=".8" points="8 1 8 6 3 6 3 8 13 8 13 1"/>
        <polygon fill="#231F20" fill-opacity=".7" points="3 13 3 12 6 10 6 11 3.8 12.5 6 14 6 15"/>
        <polygon fill="#231F20" fill-opacity=".7" points="8 14 10.2 12.5 8 11 8 10 11 12 11 13 8 15"/>
     </g>
    `,
    XML_TAG_NODE: `
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 15C4.134 15 1 11.866 1 8C1 4.134 4.134 1 8 1C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15Z" fill="#F98B9E" fill-opacity="0.6"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 8.59996V7.39996L7 5.0002V6.19996L4.8 7.99996L7 9.79996V11.0002L4 8.59996Z" fill="#231F20" fill-opacity="0.7"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9 9.79998L11.2 7.99998L9 6.19998V5.0001L12 7.39998V8.59998L9 11.0001V9.79998Z" fill="#231F20" fill-opacity="0.7"/>
    `,
    RESOURCE_ROOT_NODE:
    `
    <g fill="none" fill-rule="evenodd">
        <path fill="#9AA7B0" fill-opacity=".8" d="M7.98462,4 L6.69629,2.71143 C6.22158519,2.28563452 5.61574625,2.0346507 4.979,2 L1.05127,2 C1.037675,1.99999735 1.02463577,2.0053954 1.01502078,2.01500664 C1.00540579,2.02461787 1.00000265,2.037655 1,2.05125 L1,13 L9,13 L9,8 L15,8 L15,4 L7.98462,4 Z"/>
        <rect width="6" height="1" x="10" y="13" fill="#D9A343"/>
        <rect width="6" height="1" x="10" y="15" fill="#D9A343"/>
        <rect width="6" height="1" x="10" y="11" fill="#D9A343"/>
        <rect width="6" height="1" x="10" y="9" fill="#D9A343"/>
     </g>
    `,
    PROJECT_ROOT_NODE:
    `
    <g fill="none" fill-rule="evenodd" transform="translate(1 3)">
        <path fill="#6E6E6E" d="M14,8 L14,10 L10,10 L0,10 L0,2 L0,0 L5.39876049,0 L6.7558671,2 L14,2 L14,10 L10,10 L6,10 L6,8 L10,8 L10,4 L14,4 L14,8 Z"/>
        <rect width="3" height="3" x="11" y="5" fill="#389FD6"/>
        <rect width="3" height="3" x="11" y="9" fill="#389FD6"/>
        <rect width="3" height="3" x="7" y="9" fill="#389FD6"/>
     </g>
    `,

    CS_FOLDER_ICON: `
    <path fill="#40B6E0" 
    fill-opacity=".6" 
    fill-rule="evenodd" 
    d="M1,13 L15,13 L15,4 L7.98457,4 L6.69633,2.71149 C6.22161957,2.28559443 5.63665337,2.03457993 4.99983215,2 L1,2 L1,13 Z"/>
    `,
    CS_FILE_ICON:
    `
    <svg ti:v='1' width='16' height='15.99999237061' viewBox='0,0,16,15.99999237061' xmlns='http://www.w3.org/2000/svg' xmlns:ti='urn:schemas-jetbrains-com:tisvg'>
    <g>
        <path fill-rule='evenodd' d='M0,0L16,0L16,15.999992370610016L0,15.999992370610016Z' fill='#FFFFFF' opacity='0' />
        <path fill-rule='evenodd' d='M2,14.999992370610016L2,1.0000023706100163L9.4140000000000015,1.0000023706100163L14,5.5860023706100161L14,14.999992370610016L2,14.999992370610016Z' fill='#242424' />
        <path fill-rule='evenodd' d='M9,2.0000023706100163L3,2.0000023706100163L3,13.999992370610016L13,13.999992370610016L13,6.0000023706100158L9,2.0000023706100163Z' fill='#C4C4C4' />
        <path fill-rule='evenodd' d='M9,6.0000023706100158L9,4.0000023706100158L5,4.0000023706100158L5,11.999992370610016L11,11.999992370610016L11,6.0000023706100158L9,6.0000023706100158Z' fill='#282828' />
        <path fill-rule='evenodd' d='M2.5,15.999992370610016C1.097999999999999,15.999992370610016,0,14.682992370610016,0,12.999992370610016L0,11.999992370610016C0,10.316992370610016,1.097999999999999,9.0000023706100158,2.5,9.0000023706100158L10,9.0000023706100158L10,9.9999923706100162L11,9.9999923706100162L11,14.999992370610016L10,14.999992370610016L10,15.999992370610016L2.5,15.999992370610016Z' fill='#242424' />
        <path fill-rule='evenodd' d='M8,12.999992370610016L7,12.999992370610016L7,11.999992370610016L8,11.999992370610016M10,11.999992370610016L10,10.999992370610016L9,10.999992370610016L9,9.9999923706100162L8,9.9999923706100162L8,10.999992370610016L7,10.999992370610016L7,9.9999923706100162L6,9.9999923706100162L6,10.999992370610016L5,10.999992370610016L5,11.999992370610016L6,11.999992370610016L6,12.999992370610016L5,12.999992370610016L5,13.999992370610016L6,13.999992370610016L6,14.999992370610016L7,14.999992370610016L7,13.999992370610016L8,13.999992370610016L8,14.999992370610016L9,14.999992370610016L9,13.999992370610016L10,13.999992370610016L10,12.999992370610016L9,12.999992370610016L9,11.999992370610016M2,12.499992370610016C2,14.015992370610016,3,13.999992370610016,3,13.999992370610016L4,13.999992370610016L4,14.999992370610016L2.5,14.999992370610016C1.6720000000000006,14.999992370610016,1,14.103992370610015,1,12.999992370610016L1,11.999992370610016C1,10.895992370610017,1.6720000000000006,9.9999923706100162,2.5,9.9999923706100162L4,9.9999923706100162L4,10.999992370610016L3,10.999992370610016C3,10.999992370610016,2,10.983992370610016,2,12.499992370610016Z' fill='#86D086' />
    </g>
    </svg>
    `,
    CS_STRUCT_ICON: `
    <g fill="none" fill-rule="evenodd">
        <path fill="#62B543" fill-opacity=".6" d="M15,8 C15,11.866 11.866,15 8,15 C4.134,15 1,11.866 1,8 C1,4.134 4.134,1 8,1 C11.866,1 15,4.134 15,8"/>
        <path fill="#231F20" fill-opacity=".7" d="M3.15703839,6 C2.33436929,6 1.42394881,5.71480804 0.7,5.13345521 L1.29232176,4.23400366 C1.9285192,4.70566728 2.5976234,4.94698355 3.18994516,4.94698355 C3.76032907,4.94698355 4.08939671,4.70566728 4.08939671,4.32175503 L4.08939671,4.29981718 C4.08939671,3.85009141 3.47513711,3.69652651 2.79506399,3.488117 C1.93948812,3.24680073 0.985191956,2.89579525 0.985191956,1.79890311 L0.985191956,1.77696527 C0.985191956,0.669104205 1.89561243,-1.77635684e-14 3.04734918,-1.77635684e-14 C3.77129799,-1.77635684e-14 4.56106033,0.252285192 5.17531993,0.658135283 L4.6488117,1.60146252 C4.08939671,1.26142596 3.49707495,1.05301645 3.01444241,1.05301645 C2.49890311,1.05301645 2.20274223,1.30530165 2.20274223,1.62340037 L2.20274223,1.64533821 C2.20274223,2.07312614 2.82797075,2.24862888 3.50804388,2.46800731 C4.35265082,2.73126143 5.30694698,3.11517367 5.30694698,4.15722121 L5.30694698,4.17915905 C5.30694698,5.39670932 4.36361974,6 3.15703839,6 Z" transform="translate(5 5)"/>
    </g>
    `,
    CS_PROPERTY_ICON:
    `
    <g fill="none" fill-rule="evenodd">
        <path fill="#B99BF8" fill-opacity=".6" d="M15,8 C15,11.866 11.866,15 8,15 C4.134,15 1,11.866 1,8 C1,4.134 4.134,1 8,1 C11.866,1 15,4.134 15,8"/>
        <path fill="#231F20" fill-opacity=".7" d="M0.9974,2.8021 C0.9974,3.83569336 1.23855513,4.8771 2.5354,4.8771 C3.83224487,4.8771 4,3.4641 4,2.7921 C4,2.1061 3.90228271,0.7461 2.5244,0.7461 C1.14651729,0.7461 0.9974,1.76850664 0.9974,2.8021 Z M1,5 C1.008,5.074 1.00713333,6.074 0.9974,8 L0.0004,8 L0.0004,0.0001 L0.9974,0.0001 L0.9974,0.7461 C1.36693099,0.248766667 1.93993099,0.0001 2.7164,0.0001 C3.88110352,0.0001 5.0004,0.578186035 5.0004,2.8021 C5.0004,5.02601396 3.65454102,5.6231 2.7164,5.6231 C2.09097266,5.6231 1.51883932,5.4154 1,5 Z" transform="translate(6 5)"/>
    </g>
    `,
    CS_EVENT_ICON: `
    <polygon fill="#F4AF3D" fill-rule="evenodd" points="8.744 9.582 3.302 12.728 3.365 2.731 7.635 .266 6.89 6.387 13.302 2.685 9.69 16.152" transform="rotate(30 8.302 8.209)"/>
    `,
    CS_DELEGATE_ICON: `
	<g>
		<path fill-rule='evenodd' d='M0,0L16,0L16,16L0,16Z' fill='#FFFFFF' opacity='0' />
		<path fill-rule='evenodd' d='M12,5L5,5L5,2L12,2L12,5Z' fill='#242424' />
		<path fill-rule='evenodd' d='M14,13L3,13L3,5L14,5L14,13Z' fill='#242424' />
		<path fill-rule='evenodd' d='M11,3L11,5L10,5L10,4L7,4L7,5L6,5L6,3L11,3Z' fill='#B180D3' />
		<path fill-rule='evenodd' d='M11,9L6,9L4,7.5L4,12L13,12L13,7.5L11,9Z' fill='#B180D3' />
		<path fill-rule='evenodd' d='M4,6L6.5,8L10.5,8L13,6L4,6Z' fill='#B180D3' />
		<path fill-rule='evenodd' d='M8,10L9,10L9,8L8,8L8,10Z' fill='#282828' />
	</g>
    `,
    CS_LOCAL_FUNCTION_ICON:
    `
    <g fill="none" fill-rule="evenodd">
        <path fill="#F98B9E" fill-opacity=".6" d="M15,8 C15,11.866 11.866,15 8,15 C4.134,15 1,11.866 1,8 C1,4.134 4.134,1 8,1 C11.866,1 15,4.134 15,8"/>
        <path fill="#231F20" fill-opacity=".7" d="M1,8 L2,8 L2,4 L3.5,4 L3.5,3 L2,3 C1.99687783,2.36169171 1.99509925,2.02835838 1.99466424,2 C1.98704681,1.50341351 2.13289549,1.0728225 2.43221029,0.972167969 C2.91964141,0.808253079 3.56884985,1.02114795 3.68984985,1.06414795 L3.98519897,0.226043701 C3.90948298,0.198825534 3.4559021,0 2.81140137,0 C2.16690063,1.40512602e-16 1.81677246,0.0614013672 1.4818929,0.388793945 C1.16513106,0.698473875 1.01614114,1.22015248 1.00124609,2 C1.00039414,2.04460465 0.999980878,2.95274463 1,3 C1.00000736,3.01819872 0.666674031,3.01819872 0,3 L0,3.972 L1,3.972 L1,8 Z" transform="translate(6 4)"/>
    </g>
    `
};

export const LEVEL_ICON = {
    PROJECT_STRUCTURE_LEVEL: `
    <g fill="none" fill-rule="evenodd" transform="translate(1 3)">
        <path fill="#6E6E6E" d="M14,8 L14,10 L10,10 L0,10 L0,2 L0,0 L5.39876049,0 L6.7558671,2 L14,2 L14,10 L10,10 L6,10 L6,8 L10,8 L10,4 L14,4 L14,8 Z"/>
        <rect width="3" height="3" x="11" y="5" fill="#389FD6"/>
        <rect width="3" height="3" x="11" y="9" fill="#389FD6"/>
        <rect width="3" height="3" x="7" y="9" fill="#389FD6"/>
    </g>
    `,
    NODE_LEVEL: `
    <g fill="none" fill-rule="evenodd">
        <path fill="#9AA7B0" fill-opacity=".8" d="M1,2 L15,2 L15,15 L1,15 L1,2 Z M2,5 L2,14 L14,14 L14,5 L2,5 Z"/>
        <rect width="10" height="7" x="3" y="6" fill="#40B6E0" fill-opacity=".6"/>
    </g>
    `,
}

export default PROJECT_ICON;
