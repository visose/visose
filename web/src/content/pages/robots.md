---
title: Robots - Robot programming and custom development - visose
description: Open-source robot programming developed by visose. Used at more than 70 universities and design schools. Research, tutorials, integrations and commercial support.
heading: Robots
---

We created and maintain Robots, an open-source library and Grasshopper plugin for programming industrial robots. It supports motion simulation and controller-code generation, and can also be used in custom .NET applications.

- [Downloads and documentation](#downloads-and-documentation)
- [Support and development](#support-and-development)

## Programming and simulation {#programming-and-simulation}

Users define toolpaths, tools, reference frames and process commands in Grasshopper, simulate the robot's motion and generate programs for its controller. Robot cells can include multiple arms, tracks and rotary positioners.

Supported manufacturers include ABB, KUKA, Universal Robots, Stäubli, FANUC, Franka, Doosan, igus and JAKA.

### A reusable software core {#software-architecture}

The C#/.NET library handles robot kinematics, program validation, motion simulation and code generation. The Grasshopper plugin exposes this functionality through visual programming components; the same library can be embedded in applications outside Rhino.

Robot and tool libraries describe the equipment. Manufacturer-specific postprocessors translate programs into controller code. This architecture supports new equipment and processes without tying the software to one robot brand or host application.

## Downloads and documentation {#downloads-and-documentation}

- [GitHub](https://github.com/visose/Robots): source code, releases and installation instructions.
- [Documentation](https://github.com/visose/Robots/wiki): guides and examples.
- [Food4Rhino](https://www.food4rhino.com/en/app/robots): Rhino and Grasshopper plugin.
- [NuGet](https://www.nuget.org/packages/Robots/): .NET library.

## Used at more than 70 universities and design schools {#teaching-and-research}

Originally developed at UCL, Robots has been used in teaching and research across 23 countries and territories. Institutions include MIT, ETH Zurich, TU Delft and the Architectural Association.

Published work ranges from timber construction and concrete printing to sheet-metal forming, textile fabrication and robotic measurement. Other developers also build tools and integrations using the library.

### Universities and design schools {#academic-institutions}

- Aalborg University _Denmark_
- Aarhus School of Architecture _Denmark_
- Academy of Arts, Architecture and Design in Prague (UMPRUM) _Czechia_
- Amsterdam University of Applied Sciences _Netherlands_
- Architectural Association _United Kingdom_
- Berlin University of the Arts (UdK) _Germany_
- Bezalel Academy of Arts and Design _Israel_
- Brandenburg University of Technology Cottbus-Senftenberg _Germany_
- BURG Giebichenstein University of Art and Design Halle _Germany_
- California College of the Arts _United States_
- Carnegie Mellon University _United States_
- Columbia University _United States_
- Cornell University _United States_
- Czech Technical University in Prague _Czechia_
- Delft University of Technology _Netherlands_
- École des Ponts _France_
- École polytechnique fédérale de Lausanne (EPFL) _Switzerland_
- École supérieure d’art et de design TALM _France_
- ETH Zurich _Switzerland_
- FH Münster _Germany_
- Florida Atlantic University _United States_
- Frankfurt University of Applied Sciences _Germany_
- Institute for Advanced Architecture of Catalonia _Spain_
- Istanbul Bilgi University _Turkey_
- Karlsruhe Institute of Technology (KIT-DDF) _Germany_
- KASK & Conservatorium, School of Arts (HOGENT / Howest) _Belgium_
- KU Leuven _Belgium_
- Leibniz University Hannover _Germany_
- London South Bank University _United Kingdom_
- Louisiana State University _United States_
- Lund University _Sweden_
- Massachusetts Institute of Technology _United States_
- Monash University _Australia_
- National Taiwan University of Science and Technology _Taiwan_
- Newcastle University _United Kingdom_
- Novosibirsk State Technical University _Russia_
- Pennsylvania State University _United States_
- Politecnico di Milano _Italy_
- Pontificia Universidad Católica de Chile _Chile_
- Pratt Institute _United States_
- Princeton University _United States_
- Queensland University of Technology _Australia_
- RMIT University _Australia_
- Royal Danish Academy _Denmark_
- RWTH Aachen University _Germany_
- Stanford University _United States_
- Stuttgart State Academy of Art and Design (ABK) _Germany_
- Tamkang University _Taiwan_
- Technische Universität Braunschweig _Germany_
- Technische Universität Darmstadt _Germany_
- Technische Universität Dresden _Germany_
- Universidad Europea de Madrid _Spain_
- Universidad Técnica Federico Santa María _Chile_
- University College London _United Kingdom_
- University of A Coruña _Spain_
- University of British Columbia _Canada_
- University of Calgary _Canada_
- University of Camerino _Italy_
- University of East London _United Kingdom_
- University of Freiburg _Germany_
- University of Innsbruck _Austria_
- University of Kassel _Germany_
- University of Melbourne _Australia_
- University of Oulu _Finland_
- University of Pennsylvania _United States_
- University of Porto _Portugal_
- University of Seville _Spain_
- University of Southern Denmark _Denmark_
- University of Stuttgart _Germany_
- University of Sydney _Australia_
- University of Technology Sydney _Australia_
- University of the Basque Country (UPV/EHU) _Spain_
- Virginia Tech _United States_
- Vrije Universiteit Brussel _Belgium_
- Weißensee Academy of Art Berlin _Germany_
- Xi’an Jiaotong-Liverpool University _China_

## Custom development {#support-and-development}

We develop Grasshopper tools and applications using the Robots .NET library, adapting robot programming, simulation and controller output to your manufacturing process or equipment.

Commissioned work includes [robotic 3D printing](/projects#software-for-robotic-furniture-production) and [six-axis robotic milling](/projects#cam-integration-for-six-axis-milling).

[Discuss a robotics project](/contact?area=Robots%20support%20or%20development)

### Commercial support {#commercial-support}

Commercial support includes help with setup, robot and tool libraries, onboarding, troubleshooting and compatibility updates.

## Community support {#community-support}

Ask questions and share work through [GitHub Discussions](https://github.com/visose/Robots/discussions). Community support is free, without private support or guaranteed response times.

You can support ongoing development through [GitHub Sponsors](https://github.com/sponsors/visose) or [PayPal](https://www.paypal.com/donate?hosted_button_id=GZ4W6SBU65EBQ).

Support does not certify a robot cell or replace the manufacturer's safety requirements. Programs and equipment require appropriate validation before use.

## References and resources {#references}

Research, teaching material, software and projects that use or reference Robots.

### Research papers {#reference-research}

- [Fabrication grammars: bridging design and robotics to control emergent material expressions](https://link.springer.com/article/10.1007/s41693-021-00053-0) _Construction Robotics / Springer · 2021 · Cites Robots_
- [The migrating walls: Continuously reconfigurable interlocking modular discrete structures assembled by mobile robots](https://spool.ac/index.php/spool/article/view/253) _SPOOL · 2024 · Cites Robots_
- [Learning computer-aided manufacturing from demonstration: a case study with probabilistic movement primitives in robot wood carving](https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2025.1569476/full) _Frontiers in Robotics and AI · 2025_
- [3DWoodWind: robotic winding processes for material-efficient lightweight veneer components](https://link.springer.com/article/10.1007/s41693-022-00067-2) _Construction Robotics / Springer · 2022 · Cites Robots_
- [Automated sequence and motion planning for robotic spatial extrusion of 3D trusses](https://web.mit.edu/yijiangh/www/papers/HuangGarrettMueller_ConRob2018_choreo.pdf) _MIT / Construction Robotics · 2018_
- [Haptic Learning: Towards Neural-Network-based adaptive Cobot Path-Planning for unstructured spaces](https://pdf.blucher.com.br/designproceedings/ecaadesigradi2019/ecaadesigradi2019_280.pdf) _Gabriella Rossi and Paul Nicholas / eCAADe-SIGraDi · 2019_
- [Interactive Assemblies: Man-Machine Collaboration through Building Components for As-Built Digital Models](https://www.ias.informatik.tu-darmstadt.de/uploads/Team/BorisBelousov/wibranek_caad19.pdf) _TU Darmstadt / CAAD Futures · 2019_
- [ROBO-SHEETS: Double-Layered Structure Based on Robot-Aided Plastic Sheet Thermoforming](https://caadria2021.org/wp-content/uploads/2021/03/caadria2021_144.pdf) _TU Darmstadt / CAADRIA · 2021_
- [Ceramic Forest: Robotic Die-Extrusion Variable Forming for Architectural Ceramics](https://discovery.ucl.ac.uk/id/eprint/10196951/1/2023_acadia23_v2_384%20%281%29.pdf) _Nathan King and Robert Stuart-Smith / Penn, Virginia Tech, UCL / ACADIA · 2023_
- [Localized Multi-Pass Thermoforming Through Robotic Manipulation](https://discovery.ucl.ac.uk/id/eprint/10219834/1/caadria2025_864.pdf) _Penn, Virginia Tech and UCL / CAADRIA · 2025_
- [Mixed Reality for Safe and Reliable Human-Robot Collaboration in Timber Frame Construction](https://www.mdpi.com/2075-5309/13/8/1965) _Universidad Técnica Federico Santa María / Buildings · 2023_
- [Woodot: An AI-Driven Mobile Robotic System for Sustainable Defect Repair in Custom Glulam Beams](https://www.mdpi.com/2071-1050/17/12/5574) _Sustainability · 2025_
- [Injection 3D Concrete Printing (I3DCP): Basic Principles and Case Studies](https://www.mdpi.com/1996-1944/13/5/1093) _Materials / TU Braunschweig · 2020_
- [Bric-a-Brick: Toward a Reframing of Clay-Block Wall Construction](https://www.mdpi.com/2071-1050/17/16/7417) _Sustainability · 2025_
- [Advanced Sustainable Architectural Acoustics Through Robotic Extrusion-Based Additive Manufacturing (EAM) of Fungal Biomaterials](https://www.mdpi.com/2076-3417/15/10/5587) _Penn State / Applied Sciences · 2025_
- [Extending the Robotic Workspace by Motion Tracking Large Workpieces](https://www.igd.uni-hannover.de/fileadmin/igd/dma/Forschung/Publikationen/dMA_HCI_2020_Paper_v0.7.pdf) _Mirco Becker, Victor Sardenberg and Marco Schacht / Leibniz University Hannover · 2020_
- [RoboBlox: Robotic Manufactured Blocks Driven by Daylighting Performance](https://www.researchgate.net/publication/344092299_RoboBlox_Robotic_Manufactured_Blocks_Driven_by_Daylighting_Performance) _ResearchGate · 2020_
- [Adaptive Modular Spatial Structures for Shotcrete 3D Printing](https://www.researchgate.net/publication/334131357_Adaptive_Modular_Spatial_Structures_for_Shotcrete_3D_Printing) _ResearchGate · 2019_
- [Designing Compression-Only Arch Structures Using Robotic Equilibrium Assembly](https://www.researchgate.net/publication/335473708_Designing_Compression-Only_Arch_Structures_Using_Robotic_Equilibrium_Assembly) _ResearchGate · 2019_
- [Augmented Reality Interface for Direct Robotic Welding Path Programming](https://doi.org/10.1145/3800645.3812812) _ACM Designing Interactive Systems · 2026 · Cites Robots_
- [Variable Pneumatic Thermoforming](https://discovery.ucl.ac.uk/id/eprint/10220077/1/ACADIA2024_Variable%20Pneumatic%20Thermoforming.pdf) _Penn / Pratt / Virginia Tech / UCL · ACADIA · 2024_
- [Multi-Objective Optimization of Robotically Bent In-Situ Reinforcement System](https://discovery.ucl.ac.uk/10180689/1/Multi_Objective_Optimization_of_Robotica.pdf) _Milad Showkatbakhsh, Elif Erdine and Alvaro Lopez Rodriguez · SimAUD · 2020_
- [Visual Programming for Interactive Robotic Fabrication Processes](https://ecaade.org/prev-conf/archive/ecaade2022/papers.cumincad.org/data/works/att/ecaade2022_450.pdf) _Johannes Braumann, Emanuel Gollob and Karl Singline · UfG Linz / eCAADe · 2022 · Cites Robots_
- [Felt and Fold: Design and manufacturing of customized nonwovens through robotic needle felting](https://ecaade.org/prev-conf/archive/ecaade2022/papers.cumincad.org/data/works/att/ecaade2022_138.pdf) _Weißensee Kunsthochschule Berlin / Universität Kassel · eCAADe · 2022_
- [Metabend: a hybrid human-robot collaborative workflow for mass-customized sheet-metal bending](https://link.springer.com/article/10.1007/s41693-026-00214-z) _INDEXLAB / Politecnico di Milano · Construction Robotics · 2026_
- [Construction Robotics: From Automation to Collaboration](https://doi.org/10.1146/annurev-control-080122-090049) _Stefana Parascho · Annual Review of Control, Robotics, and Autonomous Systems · 2023 · Cites Robots_
- [A Robotic Framework for High-Throughput and Multi-View 3D Digital Image Correlation (3D-DIC)](https://freidok.uni-freiburg.de/data/274292) _Robotics and Computer-Integrated Manufacturing · 2026_
- [Predicting robotic constructability in early design of a panelized structure: a surrogate model for a mobile robotic arm](https://app.iass2024.org/files/IASS_2024_Paper_608.pdf) _Seyed Hossein Zargar and Nathan C. Brown · Penn State / IASS · 2024_
- [Bring in the Noise: A robotic-aided framework for the indirect shape translation and molding of inexact geometries](https://www.researchgate.net/publication/328228372_Bring_in_the_Noise_A_robotic-aided_framework_for_the_indirect_shape_translation_and_molding_of_inexact_geometries) _Marcus Shaffer and Elena Maria Vazquez · Penn State / eCAADe · 2018_
- [Parametric Teleoperation of a Mobile Robot for Placing Printing Supports in 3D Printed Walls](https://ascelibrary.org/doi/10.1061/9780784486443.072) _ASCE proceedings · Cites Robots_
- [Robotic Equilibrium: Scaffold Free Arch Assemblies](https://www.researchgate.net/publication/329074657_Robotic_Equilibrium_Scaffold_Free_Arch_Assemblies) _Kaicong Wu and Axel Kilian · Princeton / ACADIA · 2018_
- [A Hybrid Additive Manufacturing Approach: Combining Additive Manufacturing and Green-State Concrete Milling](https://www.researchgate.net/publication/373042358_A_Hybrid_Additive_Manufacturing_Approach_Combining_Additive_Manufacturing_and_Green-State_Concrete_Milling_to_Create_a_Functionally_Integrated_Loadbearing_Concrete_Panel_System) _ACADIA · 2021_

### Theses {#reference-theses}

- [Mycelium matters: an interdisciplinary exploration of the fabrication and properties of mycelium-based materials](https://cris.vub.be/ws/portalfiles/portal/67445971/Elsacker_PhD_for_share_small.pdf) _Elise Vanden Elsacker / Vrije Universiteit Brussel · 2021_
- [Robotic Digital Reassembly: Towards physical editing of dry joined architectural aggregations](https://tuprints.ulb.tu-darmstadt.de/bitstreams/f75e1f16-95a2-4b0f-a55e-de9f67123ce9/download) _Bastian Wibranek / TU Darmstadt · 2021_
- [Integrated material practice in free-form timber structures](https://tomsvilans.com/docs/Svilans%20-%202020%20-%20Integrated%20material%20practice%20in%20free-form%20timber%20structures%20-%20final.pdf) _Tom Svilans / Royal Danish Academy / CITA · 2021_
- [Empirical Research on Human-AI Collaborative Architectural Design Process Through a Deep Learning Approach](https://kitakyu.repo.nii.ac.jp/record/2000051/files/%28KKDE1248WD%29%E7%94%B2%E7%AC%AC248%E5%8F%B7_%E3%83%AF%E3%83%B3%20%E3%83%80.pdf) _Da Wan / University of Kitakyushu · 2023 · Cites Robots_
- [Digital Fabrication of Timber Joint and Articulation Design](https://etds.lib.tku.edu.tw/ETDS/Home/Detail/U0002-2202202218212300) _Po-Jung Chen / Tamkang University · 2022 · Cites Robots_
- [Wood-Based 3D Printing: Potential & limitation to 3D print a window frame with pure cellulose & lignin](https://repository.tudelft.nl/file/File_73a779ee-a341-4046-87c3-ac725d329865) _Christopher Bierach · TU Delft · 2022_
- [Toward Design-to-Fabrication Continuum for Open-Source Computational Robotic Ecologies in the Post-Anthropogenic Era](https://cxlso.github.io/dissertation/) _Celso Urroz / Florida Atlantic University · 2026 · Cites Robots_
- [The Application of Robotic Fabrication for Pure Timber Construction with Multiple Directions of Tenon and Mortise Joints](https://etds.lib.tku.edu.tw/ETDS/Home/Detail/U0002-2608202014364800) _Ming-Yang Wang · Tamkang University · 2020 · Cites Robots_

### Teaching and tutorials {#reference-teaching}

- [Design for Robotics, Global Summer School 2023](https://globalschool.iaac.net/gss23_design-for-robotics-course-2/) _IAAC_
- [Download & Install Robots for Grasshopper](https://ms-kb.msd.unimelb.edu.au/msd-robotics-lab/software/software/rhino-and-grasshopper-1/download-and-install-robots-for-grasshopper) _University of Melbourne, MSD Robotics Lab_
- [Robotics and Autonomous Systems](https://ras.design.upenn.edu/?page=2) _University of Pennsylvania_
- [UR5 (CB3) Robot Programming](https://digipedia.tudelft.nl/subject/ur5-tutorials/) _TU Delft · 2025 update_
- [Computer-Controlled Machining / Week 13 student work](https://fab.cba.mit.edu/classes/863.23/Architecture/people/Simon/week13.html) _MIT, How to Make (Almost) Anything · 2023_
- [Tutorial 2.3: Robotic Fabrication](https://genenv.github.io/des212-2026/pages/tutorial-2-3.html) _UBC SALA / DES 212 · 2026_
- [Fab Academy: robotics and Wildcard Week](https://fabacademy.org/2025/labs/aindustriosa/students/pepe-vazquez/docs/assignments/week-17/) _Fab Academy / A Industriosa / Pepe Vázquez · 2025_
- [Control de robots desde Grasshopper](https://crefad2026.vercel.app/es/programa) _CREFAD · 2026_
- [MAS.865: Path Planning software resources](https://fab.cba.mit.edu/classes/865.21/topics/path_planning/software.html) _MIT · 2021_
- [UR10 robot arm instructions](https://www.formlab.schoolofarts.be/instructions/doku.php?id=ur10_robot_arm%3Aur10_robot_arm) _KASK / School of Arts FormLab_
- [DfPI Pathway One robotic arm workshop](https://github.com/Mjkp/DfPI_PathwayOne) _UCL / Bartlett workshop materials_
- [Rhino and Grasshopper Robots workshop](https://github.com/re-je/workshop_gh_robots) _re-je_
- [Robots: Digital Crafts course materials](https://github.com/Gititlinker/Robots---Digital-Crafts) _Bezalel Academy of Arts and Design_
- [BTU Cottbus summer-school clay-printing materials](https://github.com/HenriBenz/BTU-Cottbus_Summer-School_3D-Printing-Clay) _BTU Cottbus summer school_
- [Wave pattern for 3D printing](https://scripting.molab.eu/tutorials/wave-pattern-for-3d-printing/) _Anastasiia Ihnatkova · CAD-Scripting / MOLAB_

### Videos {#reference-videos}

- [How To Program An Industrial Robot (Grasshopper Tutorial)](https://www.youtube.com/watch?v=mJs9xws2K2g) _The Different Design · 2020_
- [Programming Robots in Grasshopper: 01 Introduction | Robots Plugin for Universal Robots](https://www.youtube.com/watch?v=vAe47zN-d48) _robin_gdwl · 2022_
- [Programming Robots in Grasshopper: 02 Installing the "Robots" Plugin](https://www.youtube.com/watch?v=LqbFFtKwg3g) _robin_gdwl · 2022_
- [Programming Robots in Grasshopper: 03 Minimal Robot Program](https://www.youtube.com/watch?v=iS2d8VGdyV0) _robin_gdwl · 2022_
- [Programming Robots in Grasshopper: 04 Send Program from Grasshopper to Universal Robot](https://www.youtube.com/watch?v=763D8xJh0gs) _robin_gdwl · 2022_
- [Programming Robots in Grasshopper: 05 Advanced Targets with the "Robots" Plugin](https://www.youtube.com/watch?v=XAW32wS8wig) _robin_gdwl · 2022_
- [Programming Robots in Grasshopper: 06 Create Custom Tool and TCP](https://www.youtube.com/watch?v=eyU2FsF7xf8) _robin_gdwl · 2022_
- [Programming Robots in Grasshopper: 07 Follow a 3D Curve](https://www.youtube.com/watch?v=RiLxQarE_zs) _robin_gdwl · 2022_
- [Programming Robots in Grasshopper: 08 Start Confirmation for UR-Robots (Custom Command)](https://www.youtube.com/watch?v=vewdf3xNF7M) _robin_gdwl · 2022_
- [Programming Robots in Grasshopper: 09 Warnings and Errors in the Robot Program](https://www.youtube.com/watch?v=XrnCte2HeEY) _robin_gdwl · 2022_
- [Programming Robots in Grasshopper: 10 Troubleshooting common Problems](https://www.youtube.com/watch?v=ErjONSD0CW8) _robin_gdwl · 2022_
- [02 - Installing Robots | Robots Plugin Course 2026](https://www.youtube.com/watch?v=HvhKfUXVUX0) _robin_gdwl · 2026_
- [03 - Simple Robot Program | Robots Plugin Course 2026](https://www.youtube.com/watch?v=EFxCMtcEIzg) _robin_gdwl · 2026_
- [04 - Direct Upload to UR Robots | Robots Plugin Course 2026](https://www.youtube.com/watch?v=dFCdhUobAFA) _robin_gdwl · 2026_
- [05 UR Upload Start Confirmation | Robots Plugin Course 2026](https://www.youtube.com/watch?v=s-IdvoPTYHM) _robin_gdwl · 2026_
- [06 Upload Large Programs with FTP | Robots Plugin Course 2026](https://www.youtube.com/watch?v=Zcpn2R2JuS0) _robin_gdwl · 2026_
- [07 - Motion Types and Target Options | Robots Plugin Course 2026](https://www.youtube.com/watch?v=Xw4kdhbR3q8) _robin_gdwl · 2026_
- [08 - Tool Definition for UR Robots | Robots Plugin Course 2026](https://www.youtube.com/watch?v=1WWGC4lycsU) _robin_gdwl · 2026_
- [09 Advanced Targets: Speeds + Blends | Robots Plugin Course 2026](https://www.youtube.com/watch?v=aW92Qj3ZKl0) _robin_gdwl · 2026_
- [10 Custom Commands and Scripting | Robots Plugin Course 2026](https://www.youtube.com/watch?v=eTGWcvEvRVQ) _robin_gdwl · 2026_
- [11: Robot Toolpath: Follow a simple curve | Robots Plugin Course 2026](https://www.youtube.com/watch?v=Gx36LTR8t2Q) _robin_gdwl · 2026_
- [12 Robot Toolpath on 3D Surface | Robots Plugin Course 2026](https://www.youtube.com/watch?v=QIPsppTSFYg) _robin_gdwl · 2026_
- [13 simple 3D Printing Toolpath | Robots Plugin Course 2026](https://www.youtube.com/watch?v=EfsxalcVnus) _robin_gdwl · 2026_
- [Grasshopper UR Robot Template Tutorial: Part 1 - Setup](https://www.youtube.com/watch?v=Jcs14sc_ZFg) _robin_gdwl · 2025_
- [Grasshopper UR Robot Template Tutorial: Part 2 - Orient](https://www.youtube.com/watch?v=9BAcOcc4xtM) _robin_gdwl · 2025_
- [Grasshopper UR Robot Template Tutorial: Part 3 - Send to Robot](https://www.youtube.com/watch?v=PxDVQCtc5ak) _robin_gdwl · 2025_
- [UR Robot Grippers and URCaps in Grasshopper](https://www.youtube.com/watch?v=9ENygL6V1Ao) _robin_gdwl · 2025_
- [Universal Robot Realtime Position and Feedback to Grasshopper and Rhino3D](https://www.youtube.com/watch?v=c1BiL6fXkgs) _robin_gdwl · 2021_
- [Universal-Robot Handwriting Project @ re:publica19](https://www.youtube.com/watch?v=Dlb_YaOoVOQ) _robin_gdwl · 2020_
- [Universal-Robot Handwriting System Overview](https://www.youtube.com/watch?v=3Km0MQjZc3Y) _robin_gdwl · 2020_
- [Advanced targets 1](https://www.youtube.com/watch?v=3aKzrSs6FT4) _robin_gdwl · 2024_
- [Robots](https://www.youtube.com/watch?v=HV44DDlDqmQ) _Bastian Wibranek · 2019_
- [DES212 Tutorial 2 3 - Robotic Arm Basics](https://www.youtube.com/watch?v=tKVSZeKMYa8) _Xun Liu · 2026_
- [Axial Jogging](https://www.youtube.com/watch?v=XMwr7HpCdQY) _designcoding · 2026_
- [Cartesian Jogging](https://www.youtube.com/watch?v=mvtpcdNor4g) _designcoding · 2026_
- [Robotic manufacturing course: Part 2 - Robot Arm Setup for Cutting ( Rhino + Grasshopper )](https://www.youtube.com/watch?v=6pJKKV-aWgc) _Gediminas Kirdeikis · 2021_
- [Robotic Thermoplastic Shape-winding](https://www.youtube.com/watch?v=9nkImklokDo) _robin_gdwl · 2019_
- [#LocurasInteligentes \_ Retratos Robot con Huawei MWC2018 by EXarchitects](https://www.youtube.com/watch?v=Qbxk_AbnK_c) _EXarchitects · 2018_
- [Robot Coctelero, by EXarchitects](https://www.youtube.com/watch?v=SWQv4CHSsBY) _EXarchitects · 2018_
- [Robot ABB Coctelero\_ by EXarchitects](https://www.youtube.com/watch?v=ZfTEYhcuha4) _EXarchitects · 2019_
- [Rhinoceros + GrassHopper = Robot Coctelero, by EXarchitects](https://www.youtube.com/watch?v=ynUDP9phbpo) _EXarchitects · 2019_
- [Ganador Oro - Mejor presentación de producto - Metacción para Philip Morris Spain](https://www.youtube.com/watch?v=Zoo8RpZPwzM) _Grupo eventoplus · 2019_

### Software and related projects {#reference-software}

- [Manis timber plate joinery solver](https://github.com/ibois-epfl/Manis-timber-plate-joinery-solver) _EPFL IBOIS · 2021_
- [Robot Components](https://robotcomponents.github.io/RobotComponents-Documentation/) _Robot Components project · Acknowledgment_
- [Universal Robots realtime feedback for Grasshopper](https://github.com/robin-gdwl/GH_Robots_URRealtimeFeedback) _robin-gdwl / GitHub_
- [URSim-Grasshopper-Link](https://github.com/a-vi-shek/URSim-Grasshopper-Link) _a-vi-shek / GitHub_
- [Frahan StonePack documentation](https://libishm1.github.io/Frahan/docs/STONEPACK_THESIS/) _Frahan / GitHub Pages · Reference_
- [Robotic Gripping](https://github.com/cxlso/Robotic_Gripping) _cxlso_
- [UR RTDE Program Cue for Grasshopper](https://github.com/cxlso/UR_RTDE_ProgramCue_GH) _cxlso_
- [RobotsExtended](https://github.com/lin-ycv/RobotsExtended) _lin-ycv_
- [HANDZONe](https://github.com/newmedia-centre/handzone) _NewMedia Centre_
- [Thermoplastic shape-winding Grasshopper definition](https://github.com/robin-gdwl/gh_thermoplastic_shapewinding) _robin-gdwl_
- [RoboPrintIFC](https://github.com/tobiasbartlog/RoboPrintIFC) _Tobias Bartlog · Code reuse_
- [TU Tools](https://github.com/ryanwhois/tu-tools) _ryanwhois · Code reuse_
- [AssemblyChain](https://github.com/YL-Lyx/ddu-gh-AssemblyChain) _YL-Lyx · Reference_
- [Robotic Printing: Grasshopper extrusion definitions](https://github.com/cxlso/Robotic_Printing) _cxlso / Florida Atlantic University_
- [ArsPostFaber](https://github.com/jmuozan/ArsPostFaber) _jmuozan · Acknowledgment_

### Projects and exhibitions {#reference-projects}

- [The Woven Memory](https://discovery.ucl.ac.uk/id/eprint/10117597/) _UCL Discovery · 2016_
- [Robot portraits for Huawei](https://exarchitects.com/portfolio/locuras-inteligentes-retratos-robots-con-huawei/) _EXarchitects_
- [Robotic bar for IQOS](https://exeventos.com/bar-robotizado-iqos/) _EXeventos_
- [Robot Coctelero Pernod Ricard](https://exeventos.com/robot-coctelero-pernod-ricard/) _EXeventos / EXarchitects · 2018_

### Articles and reviews {#reference-resources}

- [Nagami, the New Objects of Design are Machine Made](https://novedge.wordpress.com/2018/05/25/nagami-the-new-objects-of-design-are-machine-made/) _Novedge interview with Nagami · 2018_
- [Review: Architectural Robotics Software](https://designrobotics.net/2020/07/20/architectural-robotics-software/) _Design Robotics · 2020 · Software comparison_
- [Robots in Grasshopper: software comparison](https://github.com/robin-gdwl/Robots-in-Grasshopper) _robin-gdwl / GitHub · Software comparison_
- [Parametric Design in Construction](https://docs.archlogbook.co/01-industry-basics/parametric-design-in-construction) _ARCHLOGBOOK_

### Resource directories {#reference-directories}

- [Grasshopper Docs: Robots](https://grasshopperdocs.com/addons/robots.html) _Grasshopper Docs · Component reference_
- [Awesome ABB Robots](https://github.com/FLo-ABB/awesome-abb-robots) _FLo-ABB_
- [Edge-info robotics resources](https://github.com/sikang99/edge-info) _sikang99_
