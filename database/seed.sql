-- Seed data for UPSC syllabus structure

-- Insert main exam categories
INSERT INTO syllabus_topics (id, name, description, exam_type, order_index) VALUES
('prelims-root', 'Preliminary Examination', 'UPSC Civil Services Preliminary Examination', 'prelims', 1),
('mains-root', 'Main Examination', 'UPSC Civil Services Main Examination', 'mains', 2),
('interview-root', 'Personality Test (Interview)', 'UPSC Civil Services Interview', 'interview', 3);

-- Prelims Papers
INSERT INTO syllabus_topics (id, name, description, parent_id, exam_type, paper, order_index) VALUES
('prelims-gs1', 'General Studies Paper I', 'History, Geography, Polity, Economics, Environment', 'prelims-root', 'prelims', 'gs1', 1),
('prelims-csat', 'General Studies Paper II (CSAT)', 'Comprehension, Logical Reasoning, Analytical Ability, Decision Making, Problem Solving, Interpersonal Skills, Communication Skills, Basic Numeracy', 'prelims-root', 'prelims', 'csat', 2);

-- Mains Papers
INSERT INTO syllabus_topics (id, name, description, parent_id, exam_type, paper, order_index) VALUES
('mains-essay', 'Essay Paper', 'Essay Writing', 'mains-root', 'mains', 'essay', 1),
('mains-gs1', 'General Studies Paper I', 'Indian Heritage and Culture, History and Geography of the World and Society', 'mains-root', 'mains', 'gs1', 2),
('mains-gs2', 'General Studies Paper II', 'Governance, Constitution, Polity, Social Justice and International relations', 'mains-root', 'mains', 'gs2', 3),
('mains-gs3', 'General Studies Paper III', 'Technology, Economic Development, Bio diversity, Environment, Security and Disaster Management', 'mains-root', 'mains', 'gs3', 4),
('mains-gs4', 'General Studies Paper IV', 'Ethics, Integrity and Aptitude', 'mains-root', 'mains', 'gs4', 5),
('mains-optional1', 'Optional Subject Paper I', 'Optional Subject Paper I', 'mains-root', 'mains', 'optional1', 6),
('mains-optional2', 'Optional Subject Paper II', 'Optional Subject Paper II', 'mains-root', 'mains', 'optional2', 7);

-- Prelims GS1 Topics
INSERT INTO syllabus_topics (name, description, parent_id, exam_type, paper, order_index) VALUES
-- History
('Ancient History', 'Ancient Indian History and Culture', 'prelims-gs1', 'prelims', 'gs1', 1),
('Medieval History', 'Medieval Indian History', 'prelims-gs1', 'prelims', 'gs1', 2),
('Modern History', 'Modern Indian History and Freedom Struggle', 'prelims-gs1', 'prelims', 'gs1', 3),
('Art and Culture', 'Indian Art and Culture', 'prelims-gs1', 'prelims', 'gs1', 4),

-- Geography
('Physical Geography', 'World Physical Geography', 'prelims-gs1', 'prelims', 'gs1', 5),
('Indian Geography', 'Indian Geography - Physical, Social, Economic', 'prelims-gs1', 'prelims', 'gs1', 6),
('World Geography', 'World Geography', 'prelims-gs1', 'prelims', 'gs1', 7),

-- Polity
('Constitution', 'Indian Constitution and Constitutional Bodies', 'prelims-gs1', 'prelims', 'gs1', 8),
('Governance', 'Governance, Public Policy and Rights Issues', 'prelims-gs1', 'prelims', 'gs1', 9),
('International Relations', 'International Relations', 'prelims-gs1', 'prelims', 'gs1', 10),

-- Economics
('Indian Economy', 'Indian Economy and Economic Development', 'prelims-gs1', 'prelims', 'gs1', 11),
('Economic Survey', 'Economic Survey and Budget', 'prelims-gs1', 'prelims', 'gs1', 12),

-- Environment and Ecology
('Environment and Ecology', 'Environment and Ecology', 'prelims-gs1', 'prelims', 'gs1', 13),
('Climate Change', 'Climate Change and Environmental Issues', 'prelims-gs1', 'prelims', 'gs1', 14),

-- Science and Technology
('Science and Technology', 'General Science and Technology', 'prelims-gs1', 'prelims', 'gs1', 15),
('Space Technology', 'Space Technology and Applications', 'prelims-gs1', 'prelims', 'gs1', 16),

-- Current Affairs
('Current Affairs', 'Current Affairs - National and International', 'prelims-gs1', 'prelims', 'gs1', 17);

-- Mains GS1 Topics
INSERT INTO syllabus_topics (name, description, parent_id, exam_type, paper, order_index) VALUES
-- Indian Heritage and Culture
('Indian Culture', 'Salient aspects of Art Forms, Literature and Architecture from ancient to modern times', 'mains-gs1', 'mains', 'gs1', 1),
('Modern Indian History', 'Modern Indian history from about the middle of the eighteenth century until the present- significant events, personalities, issues', 'mains-gs1', 'mains', 'gs1', 2),
('Freedom Struggle', 'The Freedom Struggle — its various stages and important contributors /contributions from different parts of the country', 'mains-gs1', 'mains', 'gs1', 3),
('Post-independence Consolidation', 'Post-independence consolidation and reorganization within the country', 'mains-gs1', 'mains', 'gs1', 4),

-- History and Geography of the World and Society
('World History', 'History of the world will include events from 18th century such as industrial revolution, world wars, redrawal of national boundaries, colonization, decolonization', 'mains-gs1', 'mains', 'gs1', 5),
('Indian Society', 'Salient features of Indian Society, Diversity of India', 'mains-gs1', 'mains', 'gs1', 6),
('Role of Women', 'Role of women and women's organization, population and associated issues, poverty and developmental issues, urbanization, their problems and their remedies', 'mains-gs1', 'mains', 'gs1', 7),
('Social Empowerment', 'Effects of globalization on Indian society, Social empowerment, communalism, regionalism & secularism', 'mains-gs1', 'mains', 'gs1', 8),

-- Geography
('World Physical Geography', 'Salient features of world's physical geography', 'mains-gs1', 'mains', 'gs1', 9),
('Distribution of Resources', 'Distribution of key natural resources across the world (including South Asia and the Indian subcontinent)', 'mains-gs1', 'mains', 'gs1', 10),
('Primary Industries', 'Factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world (including India)', 'mains-gs1', 'mains', 'gs1', 11),
('Geophysical Phenomena', 'Important Geophysical phenomena such as earthquakes, Tsunami, Volcanic activity, cyclone etc., geographical features and their location', 'mains-gs1', 'mains', 'gs1', 12);

-- Mains GS2 Topics
INSERT INTO syllabus_topics (name, description, parent_id, exam_type, paper, order_index) VALUES
-- Indian Constitution
('Constitutional Framework', 'Indian Constitution- historical underpinnings, evolution, features, amendments, significant provisions and basic structure', 'mains-gs2', 'mains', 'gs2', 1),
('Functions and Responsibilities', 'Functions and responsibilities of the Union and the States, issues and challenges pertaining to the federal structure, devolution of powers and finances up to local levels and challenges therein', 'mains-gs2', 'mains', 'gs2', 2),

-- Governance
('Parliament and State Legislatures', 'Parliament and State legislatures—structure, functioning, conduct of business, powers & privileges and issues arising out of these', 'mains-gs2', 'mains', 'gs2', 3),
('Executive and Judiciary', 'Structure, organization and functioning of the Executive and the Judiciary—Ministries and Departments of the Government; pressure groups and formal/informal associations and their role in the Polity', 'mains-gs2', 'mains', 'gs2', 4),
('Constitutional Bodies', 'Salient features of the Representation of People's Act. Appointment to various Constitutional posts, powers, functions and responsibilities of various Constitutional Bodies', 'mains-gs2', 'mains', 'gs2', 5),
('Statutory Bodies', 'Statutory, regulatory and various quasi-judicial bodies', 'mains-gs2', 'mains', 'gs2', 6),

-- Government Policies
('Government Policies', 'Government policies and interventions for development in various sectors and issues arising out of their design and implementation', 'mains-gs2', 'mains', 'gs2', 7),
('Development Processes', 'Development processes and the development industry —the role of NGOs, SHGs, various groups and associations, donors, charities, institutional and other stakeholders', 'mains-gs2', 'mains', 'gs2', 8),

-- Welfare Schemes
('Welfare Schemes', 'Welfare schemes for vulnerable sections of the population by the Centre and States and the performance of these schemes', 'mains-gs2', 'mains', 'gs2', 9),
('Social Justice', 'Issues relating to development and management of Social Sector/Services relating to Health, Education, Human Resources', 'mains-gs2', 'mains', 'gs2', 10),
('Poverty and Hunger', 'Issues relating to poverty and hunger', 'mains-gs2', 'mains', 'gs2', 11),

-- Governance and Transparency
('Governance and Transparency', 'Important aspects of governance, transparency and accountability, e-governance- applications, models, successes, limitations, and potential', 'mains-gs2', 'mains', 'gs2', 12),
('Citizens Charter', 'Citizens charters, transparency & accountability and institutional and other measures', 'mains-gs2', 'mains', 'gs2', 13),
('Civil Services', 'Role of civil services in a democracy', 'mains-gs2', 'mains', 'gs2', 14),

-- International Relations
('India and Neighbors', 'India and its neighborhood- relations', 'mains-gs2', 'mains', 'gs2', 15),
('Bilateral Relations', 'Bilateral, regional and global groupings and agreements involving India and/or affecting India's interests', 'mains-gs2', 'mains', 'gs2', 16),
('International Organizations', 'Effect of policies and politics of developed and developing countries on India's interests, Indian diaspora', 'mains-gs2', 'mains', 'gs2', 17),
('Global Issues', 'Important International institutions, agencies and fora- their structure, mandate', 'mains-gs2', 'mains', 'gs2', 18);

-- Mains GS3 Topics
INSERT INTO syllabus_topics (name, description, parent_id, exam_type, paper, order_index) VALUES
('Economic Development', 'Indian Economy and issues relating to planning, mobilization, of resources, growth, development and employment', 'mains-gs3', 'mains', 'gs3', 1),
('Infrastructure', 'Infrastructure: Energy, Ports, Roads, Airports, Railways etc', 'mains-gs3', 'mains', 'gs3', 2),
('Science and Technology', 'Science and Technology- developments and their applications and effects in everyday life', 'mains-gs3', 'mains', 'gs3', 3),
('Environment Conservation', 'Conservation, environmental pollution and degradation, environmental impact assessment', 'mains-gs3', 'mains', 'gs3', 4),
('Disaster Management', 'Disaster and disaster management', 'mains-gs3', 'mains', 'gs3', 5),
('Internal Security', 'Linkages between development and spread of extremism', 'mains-gs3', 'mains', 'gs3', 6);

-- Mains GS4 Topics
INSERT INTO syllabus_topics (name, description, parent_id, exam_type, paper, order_index) VALUES
('Ethics and Human Interface', 'Ethics and Human Interface: Essence, determinants and consequences of Ethics in-human actions', 'mains-gs4', 'mains', 'gs4', 1),
('Attitude', 'Attitude: content, structure, function; its influence and relation with thought and behaviour', 'mains-gs4', 'mains', 'gs4', 2),
('Aptitude and Values', 'Aptitude and foundational values for Civil Service, integrity, impartiality and non-partisanship', 'mains-gs4', 'mains', 'gs4', 3),
('Emotional Intelligence', 'Emotional intelligence-concepts, and their utilities and application in administration and governance', 'mains-gs4', 'mains', 'gs4', 4),
('Public Administration Ethics', 'Public/Civil service values and Ethics in Public administration', 'mains-gs4', 'mains', 'gs4', 5),
('Probity in Governance', 'Probity in Governance: Concept of public service; Philosophical basis of governance and probity', 'mains-gs4', 'mains', 'gs4', 6);
