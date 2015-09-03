cycligent.js
============

Version 1.0.0

Copyright 2008-2015 Improvement Interactive All Rights Reserved Worldwide

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License above in the LICENSE file or at:

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Getting
-------

- You can use the `cycligent.js` or `cycligent.min.js` files in this repo.
- Available as npm module named `cycligent.js` - https://www.npmjs.com/package/cycligent.js
- Available as bower module named `cycligent.js`

Description
-----------

- Asynchronous Script Loading - **WITHOUT DEPENDENCY DECLARATION**
- Classic Object Model - classes, inheritance and interfaces
- Function Argument Augmentation
- Advanced Testing Support
- Works with other JavaScript frameworks, including Angular.js (including lazy loading)

Details
--------
  
- Asynchronous loading of scripts via import
  - Dependencies do not need to be declared
  - Dependencies are automatically determined during startup for Cycligent
    classes and modules.
- A classic object model
  - inheritance
  - interfaces
  - private methods (no syntactical sugar required)
- Function argument augmentation and validation.
  - Mapped or ordered arguments to the same function
  - Default values for optional arguments
  - Validation of supplied arguments (required, quantity and
    type)
  - Handling of advance types (Arrays and HTML elements)
  - Reuse of argument specifications, especially as it relates to
    interfaces.
- Advanced testing support
  - Unit
  - End-to-end
- Works with other JavaScript frameworks, including Angular.js.
- Supports IE9+, Firefox, Chrome, and Safari.
- No external dependencies.

Changes from the previous version
---------------------------------
  
- cycligent.url got rid of '/' as having meaning within dotted names,
  and now takes the presence of a slash to mean that we're working with a URL.
- kernel.js has been combined with cycligent.js
